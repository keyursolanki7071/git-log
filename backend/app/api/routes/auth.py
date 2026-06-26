import jwt
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.user import User
from app.models.integration import Integration
from app.api.dependencies import get_current_user
from app.services.github_service import github_service

router = APIRouter()


@router.get("/github/login")
async def github_login(
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Initiates the GitHub OAuth flow.
    We encode the user ID into the 'state' parameter securely using JWT so we 
    can identify them when GitHub redirects back to us.
    """
    # Create a short-lived signed state token containing user.id
    state_token = jwt.encode(
        {"sub": str(current_user.id), "type": "github_oauth"}, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    
    url = github_service.get_authorization_url(state=state_token)
    return {"url": url}


@router.get("/github/callback")
async def github_callback(
    code: str,
    state: str,
    session: Annotated[AsyncSession, Depends(get_db)],
):
    """
    Handles the redirect back from GitHub.
    Exchanges code for token, and links it to the user.
    """
    # 1. Verify the state parameter to extract user_id
    try:
        payload = jwt.decode(state, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "github_oauth":
            raise ValueError("Invalid token type")
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid state parameter")

    # 2. Exchange code for access token
    access_token = await github_service.exchange_code_for_token(code)
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to exchange code for token")

    # 3. Get GitHub user profile
    profile = await github_service.get_github_user_profile(access_token)
    if not profile:
        raise HTTPException(status_code=400, detail="Failed to fetch GitHub profile")
        
    github_id = str(profile.get("id"))
    github_username = profile.get("login")

    # 4. Save or update the Integration in the database
    # Check if this user already has THIS github integration connected
    result = await session.execute(
        select(Integration)
        .where(Integration.user_id == user_id)
        .where(Integration.provider == "github")
        .where(Integration.provider_account_id == github_id)
    )
    integration = result.scalar_one_or_none()

    if integration:
        # Update existing
        integration.access_token = access_token
        integration.username = github_username
    else:
        # Create new
        integration = Integration(
            user_id=user_id,
            provider="github",
            provider_account_id=github_id,
            access_token=access_token,
            username=github_username,
        )
        session.add(integration)
        
    await session.commit()

    # Redirect to frontend dashboard (hardcoded for now, should come from env in prod)
    return RedirectResponse(url="http://localhost:5173/connect?success=true")
