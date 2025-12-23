from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.budget import Budget, Expense, BudgetStatus
from app.schemas.budget import (
    BudgetCreate,
    BudgetUpdate,
    BudgetResponse,
    ExpenseCreate,
    ExpenseResponse,
)

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.post("", response_model=BudgetResponse)
def create_budget(payload: BudgetCreate, db: Session = Depends(get_db)):
    # period uniqueness per franchise/branch
    exists = (
        db.query(Budget)
        .filter(
            Budget.franchise_id == payload.franchise_id,
            Budget.branch_id == payload.branch_id,
            Budget.period == payload.period,
        )
        .first()
    )
    if exists:
        raise HTTPException(status_code=400, detail="Budget for this period already exists")

    budget = Budget(
        franchise_id=payload.franchise_id,
        branch_id=payload.branch_id,
        period=payload.period,
        currency=payload.currency,
        planned_amount=payload.planned_amount,
        status=BudgetStatus.draft,
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.get("", response_model=list[BudgetResponse])
def list_budgets(
    franchise_id: int | None = None,
    branch_id: int | None = None,
    period: str | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Budget)
    if franchise_id is not None:
        q = q.filter(Budget.franchise_id == franchise_id)
    if branch_id is not None:
        q = q.filter(Budget.branch_id == branch_id)
    if period is not None:
        q = q.filter(Budget.period == period)
    return q.offset(skip).limit(limit).all()


@router.get("/{budget_id}", response_model=BudgetResponse)
def get_budget(budget_id: int, db: Session = Depends(get_db)):
    b = db.query(Budget).get(budget_id)
    if not b:
        raise HTTPException(status_code=404, detail="Budget not found")
    return b


@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(budget_id: int, payload: BudgetUpdate, db: Session = Depends(get_db)):
    b = db.query(Budget).get(budget_id)
    if not b:
        raise HTTPException(status_code=404, detail="Budget not found")
    data = payload.dict(exclude_unset=True)
    for k, v in data.items():
        setattr(b, k, v)
    db.commit()
    db.refresh(b)
    return b


@router.delete("/{budget_id}")
def delete_budget(budget_id: int, db: Session = Depends(get_db)):
    b = db.query(Budget).get(budget_id)
    if not b:
        raise HTTPException(status_code=404, detail="Budget not found")
    db.delete(b)
    db.commit()
    return {"message": "Budget deleted"}


@router.post("/{budget_id}/approve", response_model=BudgetResponse)
def approve_budget(budget_id: int, db: Session = Depends(get_db)):
    b = db.query(Budget).get(budget_id)
    if not b:
        raise HTTPException(status_code=404, detail="Budget not found")
    b.status = BudgetStatus.approved
    if b.approved_amount is None:
        b.approved_amount = b.planned_amount
    db.commit()
    db.refresh(b)
    return b


@router.post("/{budget_id}/reject", response_model=BudgetResponse)
def reject_budget(budget_id: int, db: Session = Depends(get_db)):
    b = db.query(Budget).get(budget_id)
    if not b:
        raise HTTPException(status_code=404, detail="Budget not found")
    b.status = BudgetStatus.rejected
    db.commit()
    db.refresh(b)
    return b


@router.get("/{budget_id}/summary")
def budget_summary(budget_id: int, db: Session = Depends(get_db)):
    b = db.query(Budget).get(budget_id)
    if not b:
        raise HTTPException(status_code=404, detail="Budget not found")
    planned = float(b.planned_amount or 0)
    approved = float(b.approved_amount or 0)
    actual = float(b.actual_amount or 0)
    variance = actual - planned
    burn_rate = (actual / planned) if planned > 0 else None
    return {
        "planned": planned,
        "approved": approved,
        "actual": actual,
        "variance": variance,
        "burn_rate": burn_rate,
        "currency": b.currency,
        "status": b.status,
        "period": b.period,
    }


@router.get("/rollup")
def rollup(
    franchise_id: int,
    period: str,
    branch_id: int | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(
        func.coalesce(func.sum(Budget.planned_amount), 0),
        func.coalesce(func.sum(Budget.approved_amount), 0),
        func.coalesce(func.sum(Budget.actual_amount), 0),
    ).filter(Budget.franchise_id == franchise_id, Budget.period == period)
    if branch_id is not None:
        q = q.filter(Budget.branch_id == branch_id)
    planned, approved, actual = q.first()
    planned = float(planned or 0)
    approved = float(approved or 0)
    actual = float(actual or 0)
    return {
        "planned": planned,
        "approved": approved,
        "actual": actual,
        "variance": actual - planned,
        "burn_rate": (actual / planned) if planned > 0 else None,
    }


expenses_router = APIRouter(prefix="/expenses", tags=["expenses"])


@expenses_router.post("", response_model=ExpenseResponse)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    exp = Expense(**payload.dict())
    db.add(exp)
    # update related budget actuals if linked
    if exp.budget_id:
        b = db.query(Budget).get(exp.budget_id)
        if b:
            b.actual_amount = func.coalesce(b.actual_amount, 0) + exp.amount
    db.commit()
    db.refresh(exp)
    return exp


@expenses_router.get("", response_model=list[ExpenseResponse])
def list_expenses(
    franchise_id: int | None = None,
    branch_id: int | None = None,
    budget_id: int | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Expense)
    if franchise_id is not None:
        q = q.filter(Expense.franchise_id == franchise_id)
    if branch_id is not None:
        q = q.filter(Expense.branch_id == branch_id)
    if budget_id is not None:
        q = q.filter(Expense.budget_id == budget_id)
    return q.order_by(Expense.date.desc()).offset(skip).limit(limit).all()


@expenses_router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    e = db.query(Expense).get(expense_id)
    if not e:
        raise HTTPException(status_code=404, detail="Expense not found")
    return e


@expenses_router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    e = db.query(Expense).get(expense_id)
    if not e:
        raise HTTPException(status_code=404, detail="Expense not found")
    # adjust budget actual if linked
    if e.budget_id:
        b = db.query(Budget).get(e.budget_id)
        if b:
            b.actual_amount = func.coalesce(b.actual_amount, 0) - e.amount
    db.delete(e)
    db.commit()
    return {"message": "Expense deleted"}
