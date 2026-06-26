import asyncio
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

class CommitDetail(BaseModel):
    author: str = Field(description="Author of the commit")
    date: str = Field(description="Date of the commit, e.g., 'YYYY-MM-DD'")
    message: str = Field(description="Original commit message")
    summary: str = Field(description="A brief, readable 1-sentence summary of what this commit did.")

class ChunkResult(BaseModel):
    commits: list[CommitDetail]

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def process_chunk(self, chunk: list[dict]) -> list[CommitDetail]:
        commit_summaries = []
        for c in chunk:
            commit_summaries.append(f"[{c.get('date', '')}] {c.get('author', 'Unknown')}: {c.get('message', '')}")
            
        commits_text = "\n".join(commit_summaries)
        
        prompt = f"""
You are an AI assistant processing a batch of git commits.
Please provide a 1-sentence summary for EVERY single commit along with its date and author.
Ensure every commit from the input is included in the output.

Commits:
{commits_text}
"""
        try:
            completion = await self.client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes git commits."},
                    {"role": "user", "content": prompt}
                ],
                response_format=ChunkResult,
            )
            result = completion.choices[0].message.parsed
            return result.commits if result else []
        except Exception as e:
            print(f"Error processing chunk: {e}")
            return []

    async def generate_report(self, repository_name: str, commits: list[dict], date_from: str, date_to: str) -> dict:
        if not commits:
            return {
                "executive_summary": "No commits found in the selected date range.",
                "key_achievements": [],
                "areas_of_concern": [],
                "developer_metrics": {"total_commits": "0"},
                "all_commits": []
            }

        # 1. Process commits in chunks of 100 to get summaries for all commits
        chunk_size = 100
        chunks = [commits[i:i + chunk_size] for i in range(0, len(commits), chunk_size)]
        
        chunk_tasks = [self.process_chunk(chunk) for chunk in chunks]
        chunk_results = await asyncio.gather(*chunk_tasks)
        
        # Aggregate commits
        all_commits = []
        for res in chunk_results:
            all_commits.extend([c.model_dump() for c in res])

        # 2. Generate the high-level report overview (using up to 300 commits so we don't blow token limits)
        commit_summaries_top = []
        for c in commits[:300]: 
            commit_summaries_top.append(f"[{c.get('date', '')}] {c.get('author', 'Unknown')}: {c.get('message', '')}")
            
        commits_text_top = "\n".join(commit_summaries_top)

        prompt_overview = f"""
You are a Staff Engineering Manager analyzing the activity for repository '{repository_name}' 
between {date_from} and {date_to}.

Based on the following commit logs, generate a high-level Engineering Velocity report.
Be concise but insightful.

Commits:
{commits_text_top}
"""

        try:
            completion = await self.client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert engineering manager. Analyze the provided git history and extract insights."},
                    {"role": "user", "content": prompt_overview}
                ],
                response_format=ReportSchema,
            )
            
            overview_result = completion.choices[0].message.parsed
            if not overview_result:
                overview_dict = {}
            else:
                overview_dict = overview_result.model_dump()
            
            # Convert list of Metric objects back to a dictionary
            metrics_dict = {}
            for metric in overview_dict.get("developer_metrics", []):
                metrics_dict[metric["name"]] = metric["value"]
            overview_dict["developer_metrics"] = metrics_dict
            
            # Add the detailed commit summaries
            overview_dict["all_commits"] = all_commits
            
            return overview_dict
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            raise e
