# Quick Start Guide

## Option 1: Docker Compose (Recommended)

### Prerequisites

- Docker Desktop installed and running

### Steps

1. **Navigate to the project directory:**

   ```bash
   cd path/to/Entretien_Project
   ```

2. **Start the application:**

   ```bash
   docker-compose up -d
   ```

3. **Access the application:**

   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8000
   - **API Documentation:** http://localhost:8000/docs
   - **Database:** PostgreSQL on localhost:5432

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

---

## Option 2: Manual Setup

### Backend Setup

**Prerequisites:**

- Python 3.10+
- PostgreSQL 15+

**Steps:**

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Create virtual environment:**

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables:**

   ```bash
   cp .env.example .env
   ```

5. **Edit `.env` and configure database URL:**

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/franchise_db
   ```

6. **Start the backend server:**

   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`

---

### Frontend Setup

**Prerequisites:**

- Node.js 18+
- npm or yarn

**Steps:**

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

---

## Database Setup (Manual Only)

### Using PostgreSQL Directly

1. **Create database and user:**

   ```sql
   CREATE USER user WITH PASSWORD 'password';
   CREATE DATABASE franchise_db OWNER user;
   GRANT ALL PRIVILEGES ON DATABASE franchise_db TO user;
   ```

2. **Tables will be created automatically** when the backend starts (using SQLAlchemy)

---

## API Endpoints

### Health Check

- `GET /health` - Check API status

### Franchises

- `POST /franchises` - Create franchise
- `GET /franchises` - List franchises (pagination: skip, limit)
- `GET /franchises/{id}` - Get franchise details
- `PUT /franchises/{id}` - Update franchise
- `DELETE /franchises/{id}` - Delete franchise

### Branches

- `POST /branches` - Create branch
- `GET /branches` - List branches (filter by franchise_id)
- `GET /branches/{id}` - Get branch details
- `DELETE /branches/{id}` - Delete branch

### Interactive API Documentation

Visit `http://localhost:8000/docs` (Swagger UI) to test all endpoints

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5432 (database)
lsof -ti:5432 | xargs kill -9
```

### Database Connection Error

- Verify PostgreSQL is running
- Check `.env` DATABASE_URL matches your PostgreSQL credentials
- Ensure database `franchise_db` exists

### Frontend Can't Connect to Backend

- Verify backend is running on `http://localhost:8000`
- Check CORS is enabled in `backend/main.py`
- Verify API endpoint in `frontend/src/api.ts`

### Docker Issues

```bash
# Remove all containers
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

---

## Development Tips

### Backend

- Use `http://localhost:8000/docs` for interactive API testing
- Modify files and the server auto-reloads (in dev mode)
- Check logs with `docker-compose logs backend`

### Frontend

- Hot reload is enabled in dev server
- Check browser console for errors
- API calls go through proxy (configured in `vite.config.ts`)

---

## Next Steps

1. **Create some franchises** via the dashboard
2. **Add branches** to franchises
3. **View statistics** on the dashboard
4. **Explore API documentation** at `/docs`

Enjoy! 🚀
