# Project Structure

## Complete Directory Layout

```
Entretien_Project/
│
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models/                  # SQLAlchemy ORM Models
│   │   │   ├── __init__.py
│   │   │   ├── franchise.py         # Franchise model
│   │   │   └── branch.py            # Branch model
│   │   ├── schemas/                 # Pydantic Schemas (Validation)
│   │   │   ├── __init__.py
│   │   │   ├── franchise.py         # Franchise request/response schemas
│   │   │   └── branch.py            # Branch request/response schemas
│   │   ├── routes/                  # API Endpoints
│   │   │   ├── __init__.py
│   │   │   ├── franchise.py         # Franchise endpoints
│   │   │   └── branch.py            # Branch endpoints
│   │   └── database/                # Database Configuration
│   │       ├── __init__.py
│   │       └── database.py          # SQLAlchemy setup
│   ├── main.py                      # FastAPI app initialization
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment variables template
│   └── Dockerfile                   # Docker configuration for backend
│
├── frontend/                         # React + Vite Frontend
│   ├── src/
│   │   ├── pages/                   # React Page Components
│   │   │   ├── Dashboard.tsx        # Dashboard with statistics
│   │   │   ├── FranchiseForm.tsx    # Create franchise form
│   │   │   ├── FranchiseList.tsx    # List franchises
│   │   │   └── BranchManagement.tsx # Branch CRUD operations
│   │   ├── api.ts                   # Axios API client
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles (Tailwind)
│   ├── index.html                   # HTML template
│   ├── package.json                 # Node dependencies
│   ├── vite.config.ts               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   ├── tsconfig.json                # TypeScript config
│   ├── .gitignore
│   └── Dockerfile                   # Docker configuration for frontend
│
├── docker-compose.yml               # Docker Compose orchestration
├── .gitignore                       # Git ignore rules
├── README.md                        # Full documentation
├── QUICKSTART.md                    # Quick start guide
└── setup.sh                         # Setup script
```

## Key Files Explained

### Backend

**main.py**

- FastAPI application entry point
- Creates database tables automatically
- Sets up CORS middleware
- Includes API routers

**models/franchise.py**

- Franchise ORM model with fields: id, name, tax_number, is_active, created_at
- One-to-many relationship with branches

**models/branch.py**

- Branch ORM model with fields: id, name, city, franchise_id
- Foreign key reference to Franchise

**schemas/franchise.py**

- FranchiseCreate: Request body validation
- FranchiseUpdate: Update request validation
- FranchiseResponse: Response data serialization

**routes/franchise.py**

- POST /franchises - Create franchise
- GET /franchises - List franchises with pagination
- GET /franchises/{id} - Get single franchise
- PUT /franchises/{id} - Update franchise
- DELETE /franchises/{id} - Delete franchise

**routes/branch.py**

- POST /branches - Create branch
- GET /branches - List branches (filter by franchise_id)
- GET /branches/{id} - Get branch
- DELETE /branches/{id} - Delete branch

### Frontend

**App.tsx**

- Main application component
- Navigation menu
- Page state management
- Route switching without React Router

**pages/Dashboard.tsx**

- Statistics overview
- Franchise count
- Branch count
- Total revenue
- Active status

**pages/FranchiseForm.tsx**

- Create new franchise
- Form validation with React Hook Form
- API integration

**pages/FranchiseList.tsx**

- Display all franchises in table
- Delete functionality
- Navigate to create form

**pages/BranchManagement.tsx**

- Create branches
- List branches
- Delete branches
- Filter by franchise

**api.ts**

- Axios instance configuration
- API endpoints
- Error handling

---

## Technology Stack Summary

| Layer                  | Technology      | Version |
| ---------------------- | --------------- | ------- |
| **Backend Framework**  | FastAPI         | 0.104+  |
| **Backend Language**   | Python          | 3.10+   |
| **ORM**                | SQLAlchemy      | 2.0+    |
| **Database**           | PostgreSQL      | 15+     |
| **Frontend Framework** | React           | 18.2+   |
| **Build Tool**         | Vite            | 5.0+    |
| **Language**           | TypeScript      | 5.2+    |
| **Styling**            | Tailwind CSS    | 3.3+    |
| **Forms**              | React Hook Form | 7.50+   |
| **HTTP Client**        | Axios           | 1.6+    |
| **Containerization**   | Docker          | Latest  |
| **Orchestration**      | Docker Compose  | 3.8+    |

---

## API Data Flow

```
Frontend (React)
    ↓
Axios API Client (frontend/src/api.ts)
    ↓
HTTP Request → Backend (FastAPI)
    ↓
FastAPI Routes (backend/app/routes/)
    ↓
Pydantic Validation (backend/app/schemas/)
    ↓
SQLAlchemy ORM (backend/app/models/)
    ↓
PostgreSQL Database
    ↓
Response (JSON)
    ↓
React State Update
    ↓
UI Re-render
```

---

## Database Relationships

```
FRANCHISES Table
┌─────────┬──────────────┬────────────┬───────────┬────────────┐
│ id (PK) │ name         │ tax_number │ is_active │ created_at │
└─────────┴──────────────┴────────────┴───────────┴────────────┘
    ▲
    │ (One-to-Many)
    │
BRANCHES Table
┌─────────┬──────────┬────────┬──────────────┐
│ id (PK) │ name     │ city   │ franchise_id │
└─────────┴──────────┴────────┴──────────────┘
                           (FK)
```

---

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@db:5432/franchise_db
```

### Frontend

- Configured in vite.config.ts proxy
- API base URL: http://localhost:8000

---

## Running the Application

### With Docker (Recommended)

```bash
docker-compose up -d
# Access: http://localhost:3000
```

### Without Docker

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: PostgreSQL (if running locally)
# Ensure PostgreSQL is running with correct credentials
```

---

## Building for Production

### Backend

```bash
docker build -t franchise-backend:1.0 ./backend
docker run -d -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:password@db:5432/franchise_db \
  franchise-backend:1.0
```

### Frontend

```bash
docker build -t franchise-frontend:1.0 ./frontend
docker run -d -p 3000:3000 franchise-frontend:1.0
```

---

## Testing Endpoints

### Using cURL

```bash
# Create Franchise
curl -X POST http://localhost:8000/franchises \
  -H "Content-Type: application/json" \
  -d '{"name":"Joker Gayrimenkul","tax_number":"12345678","is_active":true}'

# List Franchises
curl http://localhost:8000/franchises

# Create Branch
curl -X POST http://localhost:8000/branches \
  -H "Content-Type: application/json" \
  -d '{"name":"Istanbul Branch","city":"Istanbul","franchise_id":1}'

# List Branches
curl http://localhost:8000/branches
```

### Using Swagger UI

Visit: http://localhost:8000/docs

---

## Common Issues & Solutions

| Issue                     | Solution                                           |
| ------------------------- | -------------------------------------------------- |
| Port already in use       | Kill process or use different port                 |
| Database connection error | Check credentials and ensure PostgreSQL is running |
| CORS error                | Verify CORS middleware in main.py                  |
| Frontend can't reach API  | Check API URL in frontend/src/api.ts               |
| Docker build fails        | Run `docker-compose build --no-cache`              |

---

## Next Steps

1. ✅ Project structure created
2. ✅ Backend API built (FastAPI + PostgreSQL)
3. ✅ Frontend UI built (React + TypeScript)
4. ✅ Docker configuration ready
5. Start the application and test
6. Deploy to production
7. Add authentication & authorization
8. Add additional features as needed

Good luck! 🚀
