# 🧑‍💻 Team Task Manager

---

## 🌐 Live Links

- Frontend: https://team-task-manager-frontend-7mw9ly9m0-nirbhikakhajurias-projects.vercel.app/login
- Backend: https://team-task-manager-production-7500.up.railway.app/


## Tech Stack

### Frontend
- React.js


### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication


---

## Features

- User Signup & Login (JWT Authentication)
- Role-based access (Admin / Member)
- Create & manage projects
- Add team members
- Create tasks and assign users
- Kanban board (Todo / In Progress / Done)
- Update task status in real time

---

## 📂 Project Structure
frontend/
backend/

## 🚀 How to Run Locally

### Clone the repository

git clone https://github.com/nirbhikakhajuria/team-task-manager.git


### Backend setup


cd backend
npm install
npm start

### Frontend setup

cd frontend
npm install
npm start

## 🔗 API Endpoints (Backend)

### Auth
- POST /api/auth/signup
- POST /api/auth/login

### Projects
- GET /api/projects
- POST /api/projects

### Tasks
- POST /api/tasks/project/:id
- PUT /api/tasks/:id

---

## Author

- Name: Nirbhika Khajuria  
- GitHub: https://github.com/nirbhikakhajuria
- Email: nirbhikakhajuria@gmail.com  

