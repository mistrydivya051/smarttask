# SmartTask – Team Task Management Application

## Project Description

SmartTask is a full-stack task management web application designed to help teams collaborate efficiently. Users can create teams, invite members, assign tasks, set priorities and deadlines, and track task progress.

This project was developed as a student project to demonstrate full-stack web development skills, REST API design, authentication, and team-based collaboration.

---

## Features

- User registration and login
- Secure authentication using JWT
- Create and manage teams
- Invite and manage team members
- Role-based access (Owner / Member)
- Create, update, and delete tasks
- Assign tasks to team members
- Task status tracking (To Do, In Progress, Completed)
- Task priority and due dates
- Notifications for team invites and task assignments

---

## Technology Stack

### Frontend
- React.js
- Material UI
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt

### Deployment
- Render (Frontend & Backend)
- MongoDB Atlas

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/mistrydivya051/smarttask.git
cd smarttask
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` folder and add:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
JWT_EXPIRES_IN=token_expiry
```

---

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

Open the app in your browser:
```
http://localhost:5173/
```

---

## Live Demo

Backend URL:
```
https://smarttask-backend-btpx.onrender.com/
```

Frontend URL:
```
https://smarttask-frontend.onrender.com/
```

## Project Structure

### Backend Structure
```text
bakend/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── test/
├── validators/
└── server.js
```

### Frontend Structure
```text
frontend/
├── public/
├── src/
│   ├── api/            # API service calls
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── context/        # Global state (Auth, Team, Tasks)
│   ├── routes/         # Protected and public routes
│   ├── utils/          # Helper functions
│   ├── App.jsx
│   └── main.jsx
```

---

## Difficulties Faced

- Designing team-based database relationships
- Managing authentication and protected routes
- Implementing role-based permissions
- Connecting frontend and backend effectively

---

## What I Learned

- Building REST APIs using Node.js and Express
- Designing MongoDB schemas with Mongoose
- Implementing JWT-based authentication
- Structuring scalable frontend and backend code
- Debugging async operations and API issues

---

## Future Improvements

- File attachments for tasks
- Email notifications
- Activity logs for teams
- Calendar view for deadlines
- Advanced role-based permissions

---

## Author

**Divya Mistry**  


