from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.routes import franchise_router, branch_router, budget_router, expenses_router
from app.routes.auth import router as auth_router
from app.models import Franchise, Branch

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Franchise Management API",
    version="1.0.0",
    description="Professional franchise and branch management system with authentication"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(franchise_router)
app.include_router(branch_router)
app.include_router(budget_router)
app.include_router(expenses_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
