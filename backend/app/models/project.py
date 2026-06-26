import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base, UUIDMixin, TimestampMixin
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.integration import Integration

class Project(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "projects"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    integration_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("integrations.id", ondelete="SET NULL"), nullable=True)
    
    name: Mapped[str] = mapped_column(String, nullable=False) # e.g., "GitLog MVP"
    client_name: Mapped[str | None] = mapped_column(String, nullable=True)
    repository_name: Mapped[str | None] = mapped_column(String, nullable=True) # e.g., "keyursolanki7071/git-log"

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="projects")
    integration: Mapped["Integration | None"] = relationship("Integration", back_populates="projects")
