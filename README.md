# JWT AUTH SETUP
### 1. Backend Setup

Navigate to the `server` directory.

1.  **Install Dependencies:**
    ```bash
    cd server
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the `server` root and add your credentials:
    ```env
    PORT=4000
    MONGODB_URL="your_mongodb_connection_string"
    JWT_SECRET="your_super_secret_key"
    NODE_ENV="development"

    # Email Service (e.g., Brevo/SMTP)
    SMTP_USER="your_smtp_user"
    SMTP_PASSWORD="your_smtp_password"
    SENDER_EMAIL="your_sender_email@example.com"
    ```

3.  **Start Server:**
    ```bash
    npm run server
    # Server runs on http://localhost:4000
    ```

### 2. Frontend Setup

Navigate to the `client` directory.

1.  **Install Dependencies:**
    ```bash
    cd client
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the `client` root:
    ```env
    VITE_BACKEND_URL=http://localhost:4000
    ```

3.  **Start Application:**
    ```bash
    npm run dev
    # App runs on http://localhost:5173
    ```

---
// merge test


node server.js
```

---

## Questions API (No Auth Needed)

### Test 1: Get All Careers
```
GET http://localhost:5050/api/questions/careers
```
**Expected:** List of 3 careers (MLEngineer, DataScientist, SoftwareEngineer)

---

### Test 2: Get ML Engineer Easy Questions
```
GET http://localhost:5050/api/questions?career=MLEngineer&difficulty=Easy
```
**Expected:** 20 Easy questions from MLEngineerQ collection

---

### Test 3: Get Data Scientist Medium Questions
```
GET http://localhost:5050/api/questions?career=DataScientist&difficulty=Medium
```
**Expected:** 20 Medium questions from DataScientistQ collection

---

### Test 4: Get Software Engineer Hard Questions
```
GET http://localhost:5050/api/questions?career=SoftwareEngineer&difficulty=Hard
```
**Expected:** 20 Hard questions from SoftwareEngineerQ collection

---

### Test 5: Get Questions by Category
```
GET http://localhost:5050/api/questions?career=SoftwareEngineer&difficulty=Hard&category=Security
```
**Expected:** Only Security category questions

---

### Test 6: Get Single Question
```
GET http://localhost:5050/api/questions/69b1eb1f858eabad2fed4967?career=SoftwareEngineer
```
(Use an actual `_id` from your Test 4 response)

---

### Test 7: Submit Answer
```
POST http://localhost:5050/api/questions/submit
Content-Type: application/json

Body (raw JSON):
{
  "career": "SoftwareEngineer",
  "questionId": "69b1eb1f858eabad2fed4967",
  "answer": "A tree-like structure of a web page"
}
```
**Expected:** `{ "success": true, "correct": true }`

---

### Test 8: Submit Wrong Answer
```
POST http://localhost:5050/api/questions/submit
Content-Type: application/json

Body:
{
  "career": "SoftwareEngineer",
  "questionId": "69b1eb1f858eabad2fed4967",
  "answer": "wrong answer"
}
```
**Expected:** `{ "success": true, "correct": false, "correctAnswer": "..." }`

---

## Progress API (Auth Required)

### Test 9: Login First
```
POST http://localhost:5050/api/auth/login
Content-Type: application/json

Body:
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```
**Copy the token from response!**

---

### Test 10: Get Progress (with token)
```
GET http://localhost:5050/api/progress?career=MLEngineer

Authorization: Bearer <your_token>
```
In Postman: **Authorization tab → Bearer Token → Paste token**

---

### Test 11: Update Progress
```
POST http://localhost:5050/api/progress/update
Authorization: Bearer <your_token>
Content-Type: application/json

Body:
{
  "career": "MLEngineer",
  "difficulty": "Easy",
  "correct": true
}
```

---

### Test 12: Get All Progress
```
GET http://localhost:5050/api/progress/all
Authorization: Bearer <your_token>
```

---

### Test 13: Reset Progress
```
POST http://localhost:5050/api/progress/reset
Authorization: Bearer <your_token>
Content-Type: application/json

Body:
{
  "career": "MLEngineer"
}
