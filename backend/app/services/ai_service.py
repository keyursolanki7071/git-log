from app.core.config import settings
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

class Metric(BaseModel):
    name: str = Field(description="The name of the metric, e.g., 'total_commits'")
    value: str = Field(description="The value of the metric")

class ReportSchema(BaseModel):
    executive_summary: str = Field(description="A high-level summary of the engineering work over the given period.")
    key_achievements: list[str] = Field(description="List of significant features, fixes, or milestones achieved.")
    areas_of_concern: list[str] = Field(description="Potential risks, technical debt, or bottlenecks identified from the commits.")
    developer_metrics: list[Metric] = Field(description="Key metrics like commit frequency, prominent authors, etc.")

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_report(self, repository_name: str, commits: list[dict], date_from: str, date_to: str) -> dict:
        """
        Analyzes a list of commits and generates a structured report using OpenAI.
        """
        if not commits:
            return {
                "executive_summary": "No commits found in the selected date range.",
                "key_achievements": [],
                "areas_of_concern": [],
                "developer_metrics": {"total_commits": "0"}
            }

        commit_summaries = []
        for c in commits[:300]: 
            commit_summaries.append(f"[{c.get('date', '')}] {c.get('author', 'Unknown')}: {c.get('message', '')}")
            
        commits_text = "\n".join(commit_summaries)

        prompt = f"""
You are a Staff Engineering Manager analyzing the activity for repository '{repository_name}' 
between {date_from} and {date_to}.

Based on the following commit logs, generate a comprehensive Engineering Velocity report.
Be concise but insightful.

Commits:
{commits_text}
"""

        try:
            completion = await self.client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert engineering manager. Analyze the provided git history and extract insights."},
                    {"role": "user", "content": prompt}
                ],
                response_format=ReportSchema,
            )
            
            result = completion.choices[0].message.parsed
            
            if not result:
                return {}
            
            result_dict = result.model_dump()
            # Convert list of Metric objects back to a dictionary
            metrics_dict = {}
            for metric in result_dict.get("developer_metrics", []):
                metrics_dict[metric["name"]] = metric["value"]
            result_dict["developer_metrics"] = metrics_dict
            
            return result_dict
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            raise e
