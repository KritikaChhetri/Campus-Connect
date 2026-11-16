# Campus Connect – University Management System

## Project Domain
Education

## Project Description
Campus Connect is a web-based University Management System designed to simplify the management of academic and administrative activities.

The system provides a centralized platform where administrators, faculty members, and students can securely access and manage information related to courses, assignments, announcements, and academic records.

## Technology Stack
- MongoDB
- Express.js
- React.js
- Node.js

## Team Members
- Kritika Chhetri
- Khaidem Poloraj Meitei
- Biswajit Kalita
- An Nizume Baro
- Damanbha Marbaniang

## Project Structure

The project is divided into two main applications:

- `client/` - React frontend application
- `server/` - Node.js and Express backend application

## Frontend Setup

1. Open the client folder:
   `cd client`

2. Install dependencies:
   `npm install`

3. Start the development server:
   `npm run dev`

The frontend runs on:
`http://localhost:5173`

## Backend Setup

1. Open the server folder:
   `cd server`

2. Install dependencies:
   `npm install`

3. Start the backend server:
   `npm run dev`

The backend runs on:
`http://localhost:5000`

## Frontend Dependencies

- React
- React Router DOM
- Axios
- Vite

## Backend Dependencies

- Node.js
- Express.js
- CORS
- Dotenv
- Nodemon

## Environment Variables

Create a `.env` file inside the `server` folder and add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

The `.env` file is excluded from Git using `.gitignore`.

## Student API

The backend exposes these MongoDB-backed student endpoints at `http://localhost:5000/api/students`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/students` | Create a student |
| GET | `/api/students` | Retrieve all students |
| GET | `/api/students/:id` | Retrieve a student by MongoDB ID |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

Send JSON with the fields supported by the Student model: `name`, `email`, and `course` are required; `age` and `status` are optional. For example:

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "course": "BCA"
}
```

Successful responses use `{ "success": true, "message": "...", "data": ... }`. Invalid input returns `400`, missing students return `404`, and unexpected database failures return `500`.

The React student management page uses the same API for listing, creating, editing, and deleting students. By default it connects to `http://localhost:5000/api`; to use a different backend URL, set `VITE_API_URL` in `client/.env` (for example, `VITE_API_URL=http://localhost:5000/api`). Start the backend and frontend separately, then open the student registration page to manage records.

Run the backend API tests with `npm test` from the `server/` directory.
