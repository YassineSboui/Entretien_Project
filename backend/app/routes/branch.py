from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.franchise import Franchise
from app.models.branch import Branch
from app.schemas.branch import BranchCreate, BranchResponse

router = APIRouter(prefix="/branches", tags=["branches"])


@router.post("", response_model=BranchResponse)
def create_branch(branch: BranchCreate, db: Session = Depends(get_db)):
    franchise = db.query(Franchise).filter(Franchise.id == branch.franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    
    new_branch = Branch(**branch.dict())
    db.add(new_branch)
    db.commit()
    db.refresh(new_branch)
    return new_branch


@router.get("", response_model=list[BranchResponse])
def list_branches(franchise_id: int = None, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    query = db.query(Branch)
    if franchise_id:
        query = query.filter(Branch.franchise_id == franchise_id)
    
    branches = query.offset(skip).limit(limit).all()
    return branches


@router.get("/{branch_id}", response_model=BranchResponse)
def get_branch(branch_id: int, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch


@router.delete("/{branch_id}")
def delete_branch(branch_id: int, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    
    db.delete(branch)
    db.commit()
    return {"message": "Branch deleted successfully"}
