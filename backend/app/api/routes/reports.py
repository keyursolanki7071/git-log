from fastapi import APIRouter

router = APIRouter()


@router.post("/generate")
async def generate_report():
    """
    Generate an AI report for a specific project.
    """
    return {"message": "Not implemented yet"}
