from fastapi import APIRouter

router = APIRouter()


@router.post("/github")
async def github_auth():
    """
    Authenticate with GitHub.
    """
    return {"message": "Not implemented yet"}
