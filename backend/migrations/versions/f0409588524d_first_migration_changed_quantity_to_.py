"""first migration changed quantity to count

Revision ID: f0409588524d
Revises: 
Create Date: 2024-10-31 15:29:17.177320

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f0409588524d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order_items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('count', sa.Integer(), nullable=False))
        batch_op.drop_column('quantity')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order_items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('quantity', sa.INTEGER(), nullable=False))
        batch_op.drop_column('count')

    # ### end Alembic commands ###
