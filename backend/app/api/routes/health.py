from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    """
    Check if the API is running successfully.
    """
    return {"status": "ok", "message": "GitLog API is running."}
