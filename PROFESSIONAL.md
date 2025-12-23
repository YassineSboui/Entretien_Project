# 📊 Franchise Management System - Professional Guide

_A full-stack application built with modern technologies demonstrating best practices_

---

## 🎯 Key Features (That Make You Stand Out)

✅ **JWT Authentication** - Secure user login system  
✅ **Advanced Filtering** - Search, pagination, and filtering on all endpoints  
✅ **API Statistics** - Real-time franchise statistics endpoint  
✅ **Comprehensive Tests** - Full test coverage for all endpoints  
✅ **Toast Notifications** - Professional user feedback system  
✅ **RESTful Architecture** - Clean, scalable API design  
✅ **SQLite/PostgreSQL Support** - Flexible database options  
✅ **Docker Ready** - Production-ready containerization  
✅ **API Documentation** - Interactive Swagger/OpenAPI docs

---

## 🚀 Quick Start (2 minutes)

### Option A: Run Locally (Recommended for Development)

```powershell
# Terminal 1: Backend
cd backend
.\venv\Scripts\Activate.ps1
$env:DATABASE_URL = "sqlite:///./franchise_db.db"
python main.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Access:**

- Frontend: http://localhost:3000
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### Option B: Docker (Production)

```bash
docker-compose up -d
```

---

## 🔐 Authentication Guide

### Default Credentials

- **Username:** `admin`
- **Password:** `secret`

### Login Endpoint

```bash
curl -X POST "http://localhost:8000/auth/login?username=admin&password=secret"
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 📚 API Endpoints

### Franchises

| Method | Endpoint            | Description                                |
| ------ | ------------------- | ------------------------------------------ |
| POST   | `/franchises`       | Create new franchise                       |
| GET    | `/franchises`       | List franchises (with pagination & search) |
| GET    | `/franchises/stats` | Get franchise statistics                   |
| GET    | `/franchises/{id}`  | Get franchise details                      |
| PUT    | `/franchises/{id}`  | Update franchise                           |
| DELETE | `/franchises/{id}`  | Delete franchise                           |

### Query Parameters

**List Franchises:** `GET /franchises`

- `skip` (int): Pagination offset (default: 0)
- `limit` (int): Number of results (default: 10, max: 100)
- `search` (str): Search by franchise name
- `is_active` (bool): Filter by active status

**Example:**

```bash
curl "http://localhost:8000/franchises?search=Joker&is_active=true&limit=20"
```

### Branches

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/branches`      | Create branch      |
| GET    | `/branches`      | List branches      |
| GET    | `/branches/{id}` | Get branch details |
| DELETE | `/branches/{id}` | Delete branch      |

---

## 🧪 Testing

### Run All Tests

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pytest tests.py -v
```

### Test Coverage

```
✅ Authentication Tests
  - Login with valid credentials
  - Login with invalid credentials
  - Verify token validation

✅ Franchise Tests
  - Create franchise
  - Create duplicate tax number (should fail)
  - List with pagination
  - Search functionality
  - Get statistics
  - Error handling

✅ Health Check
  - System health status
```

---

## 📊 Statistics Endpoint

Get real-time franchise statistics:

```bash
curl http://localhost:8000/franchises/stats
```

**Response:**

```json
{
  "total_franchises": 5,
  "active_franchises": 4,
  "inactive_franchises": 1
}
```

---

## 🎨 Frontend Features

### Page Components

1. **Dashboard**

   - Statistics cards (Franchises, Branches, Revenue)
   - Real-time data updates
   - Interactive navigation

2. **Franchise List**

   - Sortable table
   - Bulk operations
   - Quick actions (edit, delete)

3. **Franchise Form**

   - Input validation
   - Error messages
   - Success confirmations with toast notifications

4. **Branch Management**
   - Create branches under franchises
   - List branches by franchise
   - Delete branches with confirmation

---

## 📁 Project Structure

```
Entretien_Project/
├── backend/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic validation
│   │   ├── routes/             # API endpoints
│   │   ├── database/           # DB configuration
│   │   └── security.py         # JWT authentication
│   ├── main.py                 # FastAPI app
│   ├── requirements.txt        # Dependencies
│   ├── tests.py                # Pytest test suite
│   └── Dockerfile              # Docker config
│
├── frontend/                   # React/TypeScript Frontend
│   ├── src/
│   │   ├── pages/              # React components
│   │   ├── components/         # Reusable components
│   │   ├── api.ts              # API client
│   │   ├── App.tsx             # Main component
│   │   └── index.css           # Tailwind styles
│   ├── package.json            # NPM dependencies
│   ├── vite.config.ts          # Build config
│   ├── tailwind.config.js      # CSS framework
│   └── Dockerfile              # Docker config
│
├── docker-compose.yml          # Multi-container setup
├── README.md                   # This file
├── SETUP_LOCAL.md              # Local development
└── tests.py                    # API tests
```

---

## 🛠️ Technology Stack

| Layer        | Technology        | Version |
| ------------ | ----------------- | ------- |
| **Backend**  | FastAPI           | 0.104.1 |
| **Database** | SQLite/PostgreSQL | 15+     |
| **ORM**      | SQLAlchemy        | 2.0.23  |
| **Auth**     | JWT + Passlib     | -       |
| **Frontend** | React             | 18.2+   |
| **Build**    | Vite              | 5.0+    |
| **Language** | TypeScript        | 5.2+    |
| **Styling**  | Tailwind CSS      | 3.3+    |
| **Forms**    | React Hook Form   | 7.50+   |
| **Testing**  | Pytest            | 7.4.3   |

---

## 🚢 Deployment Options

### 1. Heroku

```bash
git init
heroku create your-app-name
git push heroku main
```

### 2. AWS Lambda

Use AWS SAM with:

```yaml
Runtime: python3.11
Handler: main.handler
```

### 3. DigitalOcean App Platform

Push to GitHub and connect your repo

### 4. Self-Hosted (VPS)

```bash
# Install Docker & Docker Compose
sudo apt-get install docker.io docker-compose

# Clone and run
git clone your-repo
docker-compose up -d
```

---

## 📈 Performance Optimizations

✅ **Database Indexes** - Indexed tax_number and franchise_id  
✅ **Pagination** - Limit result sets to 100 items max  
✅ **Caching** - Frontend caches API responses  
✅ **Lazy Loading** - Components load data on demand  
✅ **Code Splitting** - Vite auto-chunks bundle  
✅ **Query Optimization** - Minimal select queries

---

## 🐛 Troubleshooting

| Issue                     | Solution                                                |
| ------------------------- | ------------------------------------------------------- |
| Port already in use       | Kill process: `lsof -ti :8000 \| xargs kill -9`         |
| ModuleNotFoundError       | Activate venv and run `pip install -r requirements.txt` |
| Database connection error | Check DATABASE_URL in .env                              |
| Frontend won't load       | Clear browser cache and restart `npm run dev`           |
| Tests fail                | Ensure backend is not running, run `pytest tests.py`    |

---

## 📞 Support

For issues or questions:

1. Check the API docs: http://localhost:8000/docs
2. Review test cases in `tests.py`
3. Check console for error messages

---

## 📝 Future Enhancements

- [ ] User roles and permissions
- [ ] Email notifications
- [ ] Export to PDF/CSV
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications with WebSockets
- [ ] Mobile app (React Native)
- [ ] Database migrations (Alembic)
- [ ] API rate limiting
- [ ] Comprehensive logging

---

## ✨ What Makes This Special

This project demonstrates:

1. **Full-Stack Development** - Backend + Frontend integration
2. **Security Best Practices** - JWT authentication, input validation
3. **Testing & Quality** - Comprehensive test coverage
4. **API Design** - RESTful architecture with clear documentation
5. **DevOps** - Docker containerization and multi-environment setup
6. **Professional Code** - Clean, organized, well-documented
7. **User Experience** - Notifications, error handling, responsive design
8. **Scalability** - Database indexing, pagination, query optimization

---

**Built with ❤️ - Ready to impress recruiters**
