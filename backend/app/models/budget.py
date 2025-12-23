from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Date, UniqueConstraint, Enum
from sqlalchemy.orm import relationship
import enum
from app.database.database import Base


class BudgetStatus(str, enum.Enum):
    draft = "draft"
    approved = "approved"
    rejected = "rejected"
    closed = "closed"


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    franchise_id = Column(Integer, ForeignKey("franchises.id"), nullable=False, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True, index=True)
    period = Column(String(7), nullable=False, index=True)  # YYYY-MM
    currency = Column(String(3), nullable=False, default="TRY")
    planned_amount = Column(Numeric(12, 2), nullable=False)
    approved_amount = Column(Numeric(12, 2), nullable=True)
    actual_amount = Column(Numeric(12, 2), nullable=False, default=0)
    status = Column(Enum(BudgetStatus), nullable=False, default=BudgetStatus.draft)

    franchise = relationship("Franchise")
    branch = relationship("Branch")
    expenses = relationship("Expense", back_populates="budget", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("franchise_id", "branch_id", "period", name="uq_budget_scope_period"),
    )


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=True, index=True)
    franchise_id = Column(Integer, ForeignKey("franchises.id"), nullable=False, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True, index=True)
    date = Column(Date, nullable=False)
    category = Column(String(100), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    note = Column(String(255), nullable=True)

    budget = relationship("Budget", back_populates="expenses")
    franchise = relationship("Franchise")
    branch = relationship("Branch")
