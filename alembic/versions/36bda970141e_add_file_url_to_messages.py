"""add_file_url_to_messages

Revision ID: 36bda970141e
Revises: eb7835f064f2
Create Date: 2026-08-09 19:38:43.673128

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '36bda970141e'
down_revision: Union[str, Sequence[str], None] = 'eb7835f064f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("messages", sa.Column("file_url", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("messages", "file_url")
