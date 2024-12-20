"""empty message

Revision ID: 663c3c627101
Revises: 
Create Date: 2024-11-02 17:16:38.354635

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '663c3c627101'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.alter_column('transaction_id',
               existing_type=sa.CHAR(length=36),
               type_=sa.String(length=36),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.alter_column('transaction_id',
               existing_type=sa.String(length=36),
               type_=sa.CHAR(length=36),
               existing_nullable=False)

    # ### end Alembic commands ###
