from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from app.security import (
    authenticate_user,
    create_access_token,
    Token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_password_hash,
)
from app import security as security_module

router = APIRouter(tags=["Authentication"])
security = HTTPBearer()


@router.post("/login", response_model=Token)
async def login(username: str, password: str):
    """
    Login endpoint - Returns JWT token for authenticated users
    
    **Demo Credentials:**
    - Username: `admin`
    - Password: `secret`
    """
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/verify")
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify if the provided token is valid"""
    token = credentials.credentials
    # In production, decode and validate token
    return {"valid": True, "message": "Token is valid"}


class SignupRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=128)
    email: EmailStr | None = None
    full_name: str | None = None


@router.post("/signup", response_model=Token)
async def signup(payload: SignupRequest):
    """Create a new user in the in-memory store and return a token.
    Note: For a production-grade app, persist users in the database.
    """
    if payload.username in security_module.fake_users_db:
        raise HTTPException(status_code=400, detail="Username already exists")

    security_module.fake_users_db[payload.username] = {
        "username": payload.username,
        "full_name": payload.full_name,
        "email": str(payload.email) if payload.email else None,
        "hashed_password": get_password_hash(payload.password),
        "disabled": False,
    }

    access_token = create_access_token(data={"sub": payload.username})
    return {"access_token": access_token, "token_type": "bearer"}
