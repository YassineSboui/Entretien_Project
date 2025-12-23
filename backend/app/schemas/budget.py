from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class BudgetCreate(BaseModel):
    franchise_id: int
    branch_id: Optional[int] = None
    period: str = Field(..., pattern=r"^\d{4}-\d{2}$")  # YYYY-MM
    currency: str = Field("TRY", min_length=3, max_length=3)
    planned_amount: float = Field(ge=0)


class BudgetUpdate(BaseModel):
    branch_id: Optional[int] = None
    currency: Optional[str] = Field(None, min_length=3, max_length=3)
    planned_amount: Optional[float] = Field(None, ge=0)
    approved_amount: Optional[float] = Field(None, ge=0)
    actual_amount: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None)


class BudgetResponse(BaseModel):
    id: int
    franchise_id: int
    branch_id: Optional[int]
    period: str
    currency: str
    planned_amount: float
    approved_amount: Optional[float]
    actual_amount: float
    status: str

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    franchise_id: int
    branch_id: Optional[int] = None
    budget_id: Optional[int] = None
    date: date
    category: str
    amount: float = Field(ge=0)
    note: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    franchise_id: int
    branch_id: Optional[int]
    budget_id: Optional[int]
    date: date
    category: str
    amount: float
    note: Optional[str]

    class Config:
        from_attributes = True
