import pytest
from fastapi.testclient import TestClient
from app.database.database import Base, SessionLocal, engine
from main import app

# Override get_db for testing
from app.database.database import get_db

def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


# Create tables for testing
Base.metadata.create_all(bind=engine)


class TestAuth:
    def test_login_success(self):
        response = client.post("/auth/login?username=admin&password=secret")
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["token_type"] == "bearer"
    
    def test_login_invalid_credentials(self):
        response = client.post("/auth/login?username=admin&password=wrongpass")
        assert response.status_code == 401
    
    def test_login_invalid_user(self):
        response = client.post("/auth/login?username=nonexistent&password=password")
        assert response.status_code == 401



def get_jwt_token():
    # Use demo credentials
    response = client.post("/auth/login?username=admin&password=secret")
    assert response.status_code == 200
    return response.json()["access_token"]


class TestFranchises:
    def get_auth_header(self):
        token = get_jwt_token()
        return {"Authorization": f"Bearer {token}"}

    def test_create_franchise(self):
        franchise_data = {
            "name": "Test Franchise",
            "tax_number": "TEST123456",
            "is_active": True
        }
        response = client.post("/franchises", json=franchise_data, headers=self.get_auth_header())
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Franchise"
        assert data["tax_number"] == "TEST123456"

    def test_create_duplicate_tax_number(self):
        franchise_data = {
            "name": "Franchise 1",
            "tax_number": "UNIQUE123",
            "is_active": True
        }
        client.post("/franchises", json=franchise_data, headers=self.get_auth_header())
        response = client.post("/franchises", json=franchise_data, headers=self.get_auth_header())
        assert response.status_code == 400

    def test_list_franchises(self):
        response = client.get("/franchises", headers=self.get_auth_header())
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_list_franchises_with_pagination(self):
        response = client.get("/franchises?skip=0&limit=5", headers=self.get_auth_header())
        assert response.status_code == 200

    def test_list_franchises_with_search(self):
        response = client.get("/franchises?search=Test", headers=self.get_auth_header())
        assert response.status_code == 200

    def test_get_franchise_stats(self):
        response = client.get("/franchises/stats", headers=self.get_auth_header())
        assert response.status_code == 200
        data = response.json()
        assert "total_franchises" in data
        assert "active_franchises" in data

    def test_get_nonexistent_franchise(self):
        response = client.get("/franchises/99999", headers=self.get_auth_header())
        assert response.status_code == 404


class TestHealth:
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
