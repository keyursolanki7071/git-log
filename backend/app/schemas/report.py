from pydantic import BaseModel, Field

class ReportSection(BaseModel):
    title: str
    items: list[str] = Field(description="List of improvements or fixes")

class BusinessReport(BaseModel):
    executive_summary: str
    security_improvements: ReportSection | None = None
    performance_improvements: ReportSection | None = None
    bug_fixes: ReportSection | None = None
    features_delivered: ReportSection | None = None
    business_impact: str
    recommendations: str | None = None
