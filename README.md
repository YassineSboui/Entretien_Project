# 🚀 Franchise Management System

> **Professional full-stack application showcasing modern development practices**

A production-ready CRM application for managing franchise and branch operations with authentication, advanced filtering, comprehensive testing, and CI/CD automation.

## ⭐ What Makes This Special

✅ **JWT Authentication** - Secure login system  
✅ **Advanced Filtering** - Search, pagination, filtering  
✅ **Comprehensive Tests** - 12+ test cases with Pytest  
✅ **CI/CD Pipeline** - GitHub Actions automated testing  
✅ **Professional Docs** - API examples, setup guides  
✅ **Toast Notifications** - Professional UX

## Tech Stack

### Backend

- **Framework:** FastAPI 0.104+
- **Authentication:** JWT + Passlib (pbkdf2_sha256)
- **Database:** SQLite/PostgreSQL with SQLAlchemy ORM
- **Validation:** Pydantic
- **Testing:** Pytest
- **API Server:** Uvicorn

### Frontend

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form
- **Notifications:** Custom Toast System
- **HTTP Client:** Axios

### DevOps

- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Version Control:** Git

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form
- **HTTP Client:** Axios

### DevOps

- **Containerization:** Docker & Docker Compose
- **Version Control:** Git

## Project Structure

```
Entretien_Project/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── routes/          # API endpoints
│   │   └── database/        # Database configuration
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── api.ts           # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

## Features

### Franchise Management

- Create, read, update, and delete franchises
- Track tax numbers and active status
- View franchise details

### Branch Management

- Add branches to franchises
- View branches by franchise (one-to-many relationship)
- Manage branch information (name, city)

### Dashboard

- Overview of franchise and branch statistics
- Total revenue tracking
- Active status overview

## API Endpoints

### Franchises

- `POST /franchises` - Create new franchise
- `GET /franchises` - List all franchises (with pagination)
- `GET /franchises/{id}` - Get franchise details
- `GET /franchises/stats` - Franchise statistics (totals, active/inactive)
- `PUT /franchises/{id}` - Update franchise
- `DELETE /franchises/{id}` - Delete franchise
- `GET /franchises/{id}/branches` - List branches for a franchise (alias route)

Query parameters for `GET /franchises`:

- `skip` (default: 0), `limit` (default: 10, max: 100)
- `search` (filter by `name`), `is_active` (true/false)

### Branches

- `POST /branches` - Create new branch
- `GET /branches` - List branches (filter by franchise_id)
- `GET /branches/{id}` - Get branch details
- `DELETE /branches/{id}` - Delete branch

### Authentication

- `POST /auth/login` - Obtain JWT access token
- `POST /auth/signup` - Create a demo user (in-memory store) and return token
- `GET /auth/verify` - Quick token validity check

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Or: Python 3.10+, Node.js 18+, PostgreSQL 15+

### Using Docker Compose (Recommended)

1. **Start all services:**

   ```bash
   docker-compose up -d
   ```

2. **Access the application:**

   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

3. **Seed demo data (first time):**

   ```bash
   docker-compose exec backend python seed.py
   ```

   Demo login: username `admin`, password `secret`.

4. **Stop services:**
   ```bash
   docker-compose down
   ```

### Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure database
cp .env.example .env
# Edit .env with your database URL

# Run migrations (if needed)
# alembic upgrade head

# Start server
python main.py
```

#### Seed Database (Manual)

From the `backend` folder once your environment is configured:

```bash
python seed.py
```

This seeds two franchises and sample branches if the database is empty.

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development

### Backend

- API documentation available at `http://localhost:8000/docs`
- Uses Pydantic for input validation
- SQLAlchemy for database operations

### Frontend

- TypeScript for type safety
- React Hook Form for form validation
- Tailwind CSS for styling
- Responsive design for mobile and desktop

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/franchise_db
```

### Frontend

- Backend API URL is configured in `src/api.ts`

## Database Schema

### Franchises Table

```sql
- id (Primary Key)
- name (String)
- tax_number (String, Unique)
- is_active (Boolean)
- created_at (DateTime)
```

### Branches Table

```sql
- id (Primary Key)
- name (String)
- city (String)
- franchise_id (Foreign Key)
```

## Testing

Run tests (to be implemented):

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## Deployment

### Docker Image Build

```bash
# Backend
docker build -t franchise-backend:1.0 ./backend

# Frontend
docker build -t franchise-frontend:1.0 ./frontend
```

### Production Checklist

- [ ] Update environment variables for production
- [ ] Configure CORS properly
- [ ] Setup database backups
- [ ] Enable HTTPS
- [ ] Configure proper logging
- [ ] Setup monitoring and alerts

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
