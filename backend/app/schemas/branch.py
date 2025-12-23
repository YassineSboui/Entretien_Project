from pydantic import BaseModel, Field


class BranchCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    city: str = Field(..., min_length=1, max_length=255)
    franchise_id: int


class BranchResponse(BaseModel):
    id: int
    name: str
    city: str
    franchise_id: int

    class Config:
        from_attributes = True
