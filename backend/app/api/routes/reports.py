from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid
from datetime import datetime
from pydantic import BaseModel

from app.db.session import get_db, AsyncSessionLocal
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.integration import Integration
from app.models.report import Report, ReportStatus
from app.services.github_service import github_service
from app.services.ai_service import AIService

router = APIRouter()

class GenerateReportRequest(BaseModel):
    integration_id: uuid.UUID
    repository_name: str
    branch_name: Optional[str] = None
    date_from: datetime
    date_to: datetime

class ReportResponse(BaseModel):
    id: uuid.UUID
    integration_id: uuid.UUID
    repository_name: str
    branch_name: Optional[str] = None
    status: str
    date_from: datetime
    date_to: datetime
    content: Optional[dict]
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

async def process_report_task(
    report_id: uuid.UUID,
    integration_id: uuid.UUID,
    repository_name: str,
    branch_name: Optional[str],
    date_from: datetime,
    date_to: datetime,
):
    async with AsyncSessionLocal() as db:
        try:
            report = await db.get(Report, report_id)
            if not report:
                return

            report.status = ReportStatus.PROCESSING
            await db.commit()

            integration = await db.get(Integration, integration_id)
            if not integration or not integration.access_token:
                raise Exception("Integration not found or access token missing")

            date_from_iso = date_from.isoformat()
            date_to_iso = date_to.isoformat()
            
            commits = await github_service.get_repository_commits(
                access_token=integration.access_token,
                repository_name=repository_name,
                since=date_from_iso,
                until=date_to_iso,
                branch=branch_name
            )

            if commits is None:
                raise Exception("Failed to fetch commits from GitHub")

            ai_service = AIService()
            report_content = await ai_service.generate_report(
                repository_name=repository_name,
                commits=commits,
                date_from=date_from_iso,
                date_to=date_to_iso
            )

            report = await db.get(Report, report_id) # reload to be safe
            report.content = report_content
            report.status = ReportStatus.COMPLETED
            await db.commit()
            
        except Exception as e:
            print(f"Report generation failed for {report_id}: {e}")
            report = await db.get(Report, report_id)
            if report:
                report.status = ReportStatus.FAILED
                report.error_message = str(e)
                await db.commit()


@router.post("/generate", response_model=ReportResponse)
async def generate_report(
    req: GenerateReportRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generate an AI report for a specific repository.
    """
    integration = await db.get(Integration, req.integration_id)
    if not integration or integration.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to use this integration")

    report = Report(
        user_id=current_user.id,
        integration_id=req.integration_id,
        repository_name=req.repository_name,
        branch_name=req.branch_name,
        date_from=req.date_from,
        date_to=req.date_to,
        status=ReportStatus.PENDING
    )
    
    db.add(report)
    await db.commit()
    await db.refresh(report)

    background_tasks.add_task(
        process_report_task,
        report_id=report.id,
        integration_id=req.integration_id,
        repository_name=req.repository_name,
        branch_name=req.branch_name,
        date_from=req.date_from,
        date_to=req.date_to
    )

    return report


@router.get("/", response_model=List[ReportResponse])
async def list_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all reports for the user.
    """
    result = await db.execute(
        select(Report)
        .where(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
    )
    reports = result.scalars().all()
    return reports


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch a specific report.
    """
    report = await db.get(Report, report_id)
    if not report or report.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return report
