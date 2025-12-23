# API Examples & Usage Guide

Complete examples for all API endpoints

---

## 🔐 Authentication

### Login

```bash
curl -X POST "http://localhost:8000/auth/login?username=admin&password=secret" \
  -H "Content-Type: application/json"
```

**Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 📊 Franchises API

### 1. Create Franchise

```bash
curl -X POST "http://localhost:8000/franchises" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Joker Gayrimenkul",
    "tax_number": "12345678",
    "is_active": true
  }'
```

**Response (200):**

```json
{
  "id": 1,
  "name": "Joker Gayrimenkul",
  "tax_number": "12345678",
  "is_active": true,
  "created_at": "2024-12-22T15:00:00"
}
```

**Error (400):**

```json
{
  "detail": "Tax number already registered"
}
```

---

### 2. List Franchises

**Basic:**

```bash
curl "http://localhost:8000/franchises"
```

**With Pagination:**

```bash
curl "http://localhost:8000/franchises?skip=0&limit=5"
```

**With Search:**

```bash
curl "http://localhost:8000/franchises?search=Joker"
```

**With Filtering:**

```bash
curl "http://localhost:8000/franchises?is_active=true"
```

**Combined:**

```bash
curl "http://localhost:8000/franchises?search=Joker&is_active=true&limit=10&skip=0"
```

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "Joker Gayrimenkul",
    "tax_number": "12345678",
    "is_active": true,
    "created_at": "2024-12-22T15:00:00"
  }
]
```

---

### 3. Get Franchise Statistics

```bash
curl "http://localhost:8000/franchises/stats"
```

**Response (200):**

```json
{
  "total_franchises": 5,
  "active_franchises": 4,
  "inactive_franchises": 1
}
```

---

### 4. Get Single Franchise

```bash
curl "http://localhost:8000/franchises/1"
```

**Response (200):**

```json
{
  "id": 1,
  "name": "Joker Gayrimenkul",
  "tax_number": "12345678",
  "is_active": true,
  "created_at": "2024-12-22T15:00:00"
}
```

**Error (404):**

```json
{
  "detail": "Franchise not found"
}
```

---

### 5. Update Franchise

```bash
curl -X PUT "http://localhost:8000/franchises/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Joker Gayrimenkul Updated",
    "is_active": false
  }'
```

**Response (200):**

```json
{
  "id": 1,
  "name": "Joker Gayrimenkul Updated",
  "tax_number": "12345678",
  "is_active": false,
  "created_at": "2024-12-22T15:00:00"
}
```

---

### 6. Delete Franchise

```bash
curl -X DELETE "http://localhost:8000/franchises/1"
```

**Response (200):**

```json
{
  "message": "Franchise deleted successfully"
}
```

---

## 🏢 Branches API

### 1. Create Branch

```bash
curl -X POST "http://localhost:8000/branches" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Istanbul Branch",
    "city": "Istanbul",
    "franchise_id": 1
  }'
```

**Response (200):**

```json
{
  "id": 1,
  "name": "Istanbul Branch",
  "city": "Istanbul",
  "franchise_id": 1
}
```

**Error (400):**

```json
{
  "detail": "Franchise not found"
}
```

---

### 2. List Branches

**All branches:**

```bash
curl "http://localhost:8000/branches"
```

**By franchise:**

```bash
curl "http://localhost:8000/branches?franchise_id=1"
```

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "Istanbul Branch",
    "city": "Istanbul",
    "franchise_id": 1
  }
]
```

---

### 3. Get Single Branch

```bash
curl "http://localhost:8000/branches/1"
```

**Response (200):**

```json
{
  "id": 1,
  "name": "Istanbul Branch",
  "city": "Istanbul",
  "franchise_id": 1
}
```

---

### 4. Delete Branch

```bash
curl -X DELETE "http://localhost:8000/branches/1"
```

**Response (200):**

```json
{
  "message": "Branch deleted successfully"
}
```

---

## 🔍 Advanced Filtering Examples

### Pagination Example

Get 5 franchises starting from position 10:

```bash
curl "http://localhost:8000/franchises?skip=10&limit=5"
```

### Search Example

Find all franchises with "Joker" in name:

```bash
curl "http://localhost:8000/franchises?search=Joker"
```

### Active Only

Get only active franchises:

```bash
curl "http://localhost:8000/franchises?is_active=true"
```

### Inactive Only

Get only inactive franchises:

```bash
curl "http://localhost:8000/franchises?is_active=false"
```

### Combined Search + Filter

Search and filter by status:

```bash
curl "http://localhost:8000/franchises?search=Joker&is_active=true&limit=20"
```

---

## 💻 Python Client Example

```python
import requests

BASE_URL = "http://localhost:8000"

# Login
response = requests.post(f"{BASE_URL}/auth/login?username=admin&password=secret")
token = response.json()["access_token"]

headers = {"Authorization": f"Bearer {token}"}

# Create franchise
franchise_data = {
    "name": "New Franchise",
    "tax_number": "NEW123456",
    "is_active": True
}
response = requests.post(
    f"{BASE_URL}/franchises",
    json=franchise_data,
    headers=headers
)
franchise_id = response.json()["id"]

# List franchises with search
response = requests.get(
    f"{BASE_URL}/franchises",
    params={"search": "New", "is_active": True, "limit": 10}
)
franchises = response.json()

# Get statistics
response = requests.get(f"{BASE_URL}/franchises/stats", headers=headers)
stats = response.json()
print(f"Total: {stats['total_franchises']}, Active: {stats['active_franchises']}")

# Create branch
branch_data = {
    "name": "Main Branch",
    "city": "Istanbul",
    "franchise_id": franchise_id
}
response = requests.post(
    f"{BASE_URL}/branches",
    json=branch_data,
    headers=headers
)

# List branches for franchise
response = requests.get(
    f"{BASE_URL}/branches",
    params={"franchise_id": franchise_id},
    headers=headers
)
branches = response.json()
```

---

## 🧪 Testing with Pytest

```bash
# Run all tests
pytest tests.py -v

# Run specific test class
pytest tests.py::TestFranchises -v

# Run with coverage
pytest tests.py --cov=app --cov-report=html
```

---

## 📱 JavaScript/Fetch Example

```javascript
const BASE_URL = "http://localhost:8000";
let token = "";

// Login
async function login() {
  const response = await fetch(
    `${BASE_URL}/auth/login?username=admin&password=secret`,
    { method: "POST" }
  );
  const data = await response.json();
  token = data.access_token;
}

// Get franchises
async function getFranchises(search = "", isActive = null) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (isActive !== null) params.append("is_active", isActive);

  const response = await fetch(`${BASE_URL}/franchises?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

// Create franchise
async function createFranchise(name, taxNumber) {
  const response = await fetch(`${BASE_URL}/franchises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      tax_number: taxNumber,
      is_active: true,
    }),
  });
  return response.json();
}

// Get statistics
async function getStats() {
  const response = await fetch(`${BASE_URL}/franchises/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}
```

---

## 🚀 Performance Tips

1. **Use pagination** for large datasets
2. **Filter before searching** to reduce results
3. **Cache responses** in frontend (React Query, SWR)
4. **Use batch operations** when possible
5. **Index frequently searched fields** (tax_number, franchise_id)

---

## 📋 HTTP Status Codes

| Code | Meaning      | Example                |
| ---- | ------------ | ---------------------- |
| 200  | Success      | Franchise created      |
| 201  | Created      | New resource created   |
| 400  | Bad Request  | Duplicate tax number   |
| 401  | Unauthorized | Invalid credentials    |
| 404  | Not Found    | Franchise not found    |
| 422  | Invalid Data | Missing required field |
| 500  | Server Error | Database error         |

---

**For interactive testing, visit:** http://localhost:8000/docs
