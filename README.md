# 🎓 Student Manager — MERN CRUD College Project

A full-stack **MERN** application for managing student records with complete **CRUD** operations.

## 📁 Project Structure

```
mern-crud/
├── backend/
│   ├── server.js               ← Express server entry
│   ├── models/Student.js       ← Mongoose schema
│   ├── controllers/studentController.js  ← CRUD logic
│   ├── routes/studentRoutes.js ← REST API routes
│   ├── .env                    ← Environment config
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── App.js              ← Main component
    │   ├── App.css             ← Global styles
    │   ├── index.js            ← React entry
    │   ├── components/
    │   │   ├── StudentForm.js  ← Add/Edit form
    │   │   └── StudentCard.js  ← Display card
    │   └── services/api.js     ← Axios HTTP calls
    └── package.json
```

## 🔌 API Endpoints

| Method | Route               | Operation   |
|--------|---------------------|-------------|
| GET    | /api/students       | Read all    |
| GET    | /api/students/:id   | Read one    |
| POST   | /api/students       | Create      |
| PUT    | /api/students/:id   | Update      |
| DELETE | /api/students/:id   | Delete      |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at: `http://localhost:5000`

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at: `http://localhost:3000`

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, Axios, CSS    |
| Backend    | Node.js, Express.js     |
| Database   | MongoDB, Mongoose       |
| Dev Tools  | Nodemon, dotenv         |
