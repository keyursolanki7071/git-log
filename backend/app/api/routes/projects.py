from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_projects():
    """
    List all projects for the authenticated user.
    """
    return {"projects": []}


@router.post("/")
async def create_project():
    """
    Create a new project.
    """
    return {"message": "Not implemented yet"}
