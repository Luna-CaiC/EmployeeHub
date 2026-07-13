# EmployeeHub

EmployeeHub is an internal workforce management platform with a Spring Boot backend and React frontend.

## Project Structure

- `backend` - Spring Boot 3.x application using Java 21 and Maven.
- `frontend` - React application using Vite, React Router, Axios, and Tailwind CSS.
- `docs` - Project documentation.
- `ai` - AI development notes and prompts.

## Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend uses `SERVER_PORT` and `FRONTEND_URL` environment variables when present.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a local `.env` file when the backend URL differs from `http://localhost:8080`.
