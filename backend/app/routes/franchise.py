from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.models.franchise import Franchise
from app.schemas.franchise import FranchiseCreate, FranchiseUpdate, FranchiseResponse
from app.models.branch import Branch
from app.schemas.branch import BranchResponse

router = APIRouter(prefix="/franchises", tags=["franchises"])


@router.post("", response_model=FranchiseResponse)
def create_franchise(franchise: FranchiseCreate, db: Session = Depends(get_db)):
    db_franchise = db.query(Franchise).filter(Franchise.tax_number == franchise.tax_number).first()
    if db_franchise:
        raise HTTPException(status_code=400, detail="Tax number already registered")
    
    new_franchise = Franchise(**franchise.dict())
    db.add(new_franchise)
    db.commit()
    db.refresh(new_franchise)
    return new_franchise


@router.get("", response_model=list[FranchiseResponse])
def list_franchises(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None),
    is_active: bool = Query(None),
    db: Session = Depends(get_db)
):
    """
    List franchises with pagination, search, and filtering
    
    - **skip**: Pagination offset (default: 0)
    - **limit**: Number of items to return (default: 10, max: 100)
    - **search**: Search by franchise name
    - **is_active**: Filter by active status
    """
    query = db.query(Franchise)
    
    if search:
        query = query.filter(Franchise.name.ilike(f"%{search}%"))
    
    if is_active is not None:
        query = query.filter(Franchise.is_active == is_active)
    
    franchises = query.offset(skip).limit(limit).all()
    return franchises


@router.get("/stats", response_model=dict)
def get_franchise_stats(db: Session = Depends(get_db)):
    """Get franchise statistics"""
    total = db.query(func.count(Franchise.id)).scalar()
    active = db.query(func.count(Franchise.id)).filter(Franchise.is_active == True).scalar()
    inactive = total - active if total else 0
    
    return {
        "total_franchises": total or 0,
        "active_franchises": active or 0,
        "inactive_franchises": inactive
    }


@router.get("/{franchise_id}", response_model=FranchiseResponse)
def get_franchise(franchise_id: int, db: Session = Depends(get_db)):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    return franchise


@router.put("/{franchise_id}", response_model=FranchiseResponse)
def update_franchise(
    franchise_id: int,
    franchise_update: FranchiseUpdate,
    db: Session = Depends(get_db)
):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    
    update_data = franchise_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(franchise, key, value)
    
    db.commit()
    db.refresh(franchise)
    return franchise


@router.delete("/{franchise_id}")
def delete_franchise(franchise_id: int, db: Session = Depends(get_db)):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    
    db.delete(franchise)
    db.commit()
    return {"message": "Franchise deleted successfully"}


@router.get("/{franchise_id}/branches", response_model=list[BranchResponse])
def list_branches_for_franchise(
    franchise_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Alias route to list branches under a specific franchise.
    Mirrors GET /branches?franchise_id=... but matches the case study path.
    """
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    branches = (
        db.query(Branch)
        .filter(Branch.franchise_id == franchise_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return branches
