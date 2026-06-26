from app.models.base import Base
from app.models.user import User
from app.models.integration import Integration
from app.models.project import Project
from app.models.report import Report

# This ensures all models are loaded before Alembic reads Base.metadata
__all__ = ["Base", "User", "Integration", "Project", "Report"]
