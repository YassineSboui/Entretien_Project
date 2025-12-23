from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class FranchiseCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    tax_number: str = Field(..., min_length=1, max_length=50)
    is_active: bool = True


class FranchiseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    is_active: Optional[bool] = None


class FranchiseResponse(BaseModel):
    id: int
    name: str
    tax_number: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
