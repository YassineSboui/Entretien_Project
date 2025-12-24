# 🚀 Franchise Management System – Unified Guide

A professional, production-ready full-stack CRM for managing franchises and branches. This guide consolidates all essential information for setup, usage, and features.

---

## 🌟 Key Features

- **JWT Authentication** (secure login, token-based)
- **Advanced Filtering & Pagination** (search, filter, stats)
- **Comprehensive Testing** (12+ Pytest cases)
- **CI/CD Pipeline** (GitHub Actions)
- **Professional Documentation** (API, setup, usage)
- **Toast Notifications** (modern UX)
- **Containerization** (Docker, Docker Compose)

---

## 🏗️ Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Pydantic, Pytest, Uvicorn
- **Frontend:** React 18 (TypeScript), Vite, Tailwind CSS, React Hook Form, Axios
- **DevOps:** Docker, GitHub Actions, Git

---

## 📁 Project Structure (Simplified)

```
Entretien_Project/
├── backend/    # FastAPI app, models, routes, tests, Dockerfile
├── frontend/   # React app, pages, components, Dockerfile
├── docker-compose.yml
```

---

## ⚡ Quick Start

### Option 1: Docker Compose (Recommended)

1. Install Docker Desktop
2. In project root:
   ```bash
   docker-compose up -d
   ```
3. Access:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend

- Python 3.10+, SQLite or PostgreSQL
- In `backend/`:
  ```bash
  python -m venv venv
  source venv/bin/activate  # or .\venv\Scripts\Activate.ps1 on Windows
  pip install -r requirements.txt
  python main.py
  ```
- Backend: http://localhost:8000

#### Frontend

- Node.js 18+
- In `frontend/`:
  ```bash
  npm install
  npm run dev
  ```
- Frontend: http://localhost:5173

---

## 🔑 Authentication

- **Login:**
  ```bash
  curl -X POST "http://localhost:8000/auth/login?username=admin&password=secret"
  ```
- Use the returned `access_token` as a Bearer token for all API requests.

---

## 📊 API Usage (Examples)

- **Create Franchise:**
  ```bash
  curl -X POST "http://localhost:8000/franchises" -H "Content-Type: application/json" -d '{"name": "Joker", "tax_number": "12345678", "is_active": true}'
  ```
- **List Franchises:**
  ```bash
  curl "http://localhost:8000/franchises?search=Joker&is_active=true&limit=10&skip=0"
  ```
- **Get Stats:**
  ```bash
  curl "http://localhost:8000/franchises/stats"
  ```
- **Branches:** Similar endpoints for create/list/delete branches.

---

## 🧪 Testing

- Run all backend tests:
  ```bash
  pytest tests.py -v
  ```

---

## 🛠️ Performance & Tips

- Use pagination and filtering for large datasets
- Cache API responses in frontend
- Use batch operations when possible

---

## 📚 More

- Interactive API docs: http://localhost:8000/docs
- For full details, see code comments and explore the project structure.

---
