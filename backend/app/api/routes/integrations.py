import uuid
from typing import Annotated, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.integration import Integration
from app.api.dependencies import get_current_user
from app.services.github_service import github_service
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class IntegrationResponse(BaseModel):
    id: uuid.UUID
    provider: str
    provider_account_id: str
    username: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=list[IntegrationResponse])
async def list_integrations(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    """
    List all connected integrations for the current user.
    """
    result = await session.execute(
        select(Integration).where(Integration.user_id == current_user.id)
    )
    integrations = result.scalars().all()
    return integrations

@router.get("/{integration_id}/repositories")
async def list_repositories(
    integration_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
) -> list[dict[str, Any]]:
    """
    List GitHub repositories for a specific integration.
    """
    result = await session.execute(
        select(Integration).where(
            Integration.id == integration_id,
            Integration.user_id == current_user.id
        )
    )
    integration = result.scalar_one_or_none()
    
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
        
    if integration.provider != "github":
        raise HTTPException(status_code=400, detail="Only GitHub integrations are supported")
        
    repos = await github_service.get_user_repositories(integration.access_token)
    
    if repos is None:
        raise HTTPException(status_code=500, detail="Failed to fetch repositories from GitHub")
        
    return repos
