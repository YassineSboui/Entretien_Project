# Local Setup Guide (Without Docker)

Since Docker is not available, use this guide to run the project locally.

## Prerequisites

- Python 3.10+ (Installed ✅)
- Node.js 18+ (npm ✅)
- PostgreSQL 12+ (Optional - using SQLite for quick start)

---

## Quick Start (SQLite - 5 minutes)

### 1. Setup Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1

# Use SQLite instead of PostgreSQL
$env:DATABASE_URL = "sqlite:///./franchise_db.db"

# Run backend
python main.py
```

Backend starts on http://localhost:8000

### 2. Setup Frontend (New Terminal)

```powershell
cd frontend
npm install
npm run dev
```

Frontend starts on http://localhost:5173

---

## Full Setup (PostgreSQL)

If you have PostgreSQL installed:

### 1. Create Database

```powershell
# Using psql or pgAdmin
CREATE DATABASE franchise_db;
```

### 2. Setup Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1

$env:DATABASE_URL = "postgresql://user:password@localhost:5432/franchise_db"

python main.py
```

### 3. Setup Frontend

```powershell
cd frontend
npm install
npm run dev
```

---

## Access the Application

- **Frontend:** http://localhost:5173 (Vite dev server)
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## Test the API

### Using curl

```powershell
# Create Franchise
$body = @{
    name = "Joker Gayrimenkul"
    tax_number = "12345678"
    is_active = $true
} | ConvertTo-Json

curl -X POST http://localhost:8000/franchises `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# List Franchises
curl http://localhost:8000/franchises
```

### Using Browser

Visit http://localhost:8000/docs for interactive API testing

---

## Troubleshooting

| Issue               | Solution                                                           |
| ------------------- | ------------------------------------------------------------------ |
| ModuleNotFoundError | Ensure venv is activated and requirements installed                |
| Port 8000 in use    | Change port: `python main.py --port 8001`                          |
| Database not found  | Create database or use SQLite URL                                  |
| npm ERR!            | Delete node_modules and package-lock.json, run `npm install` again |

---

## Next: Production Deployment

Once tested, deploy with Docker:

```bash
docker-compose up -d
```
