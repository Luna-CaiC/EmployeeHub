# EmployeeHub

EmployeeHub is a full-stack internal workforce management platform built with Spring Boot and React. Administrators can manage employees, departments, profiles, and workforce information through a secure JWT-authenticated application. Version 1.0 focuses on employee administration, department management, authentication, and a modular architecture.

## Features

### Authentication

- JWT Authentication
- Role-Based Authorization
- Profile Management
- Change Password

### Employee Management

- Employee CRUD
- Search
- Filtering
- Sorting
- Pagination

### Department Management

- Department CRUD

### Dashboard

- Workforce Summary Metrics

### System

- Global Exception Handling
- Responsive React UI

## Tech Stack

### Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA (Hibernate)
- MySQL
- Maven
- JWT Authentication

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

## Project Architecture

EmployeeHub follows a layered backend architecture with modular package organization by domain.

- **Controller**: Exposes REST endpoints and delegates business operations to services.
- **Service**: Contains business logic, validation rules, authorization-sensitive operations, and transaction boundaries.
- **Repository**: Provides database access through Spring Data JPA.
- **DTO**: Defines request and response contracts between the API and clients.
- **Entity**: Represents persisted domain models mapped to database tables.

The frontend is organized around pages, reusable components, routing, authentication state, and API client utilities.

## Project Structure

```text
.
├── backend/
│   ├── src/main/java/com/employeehub/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── department/
│   │   ├── employee/
│   │   ├── exception/
│   │   └── security/
│   ├── src/main/resources/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── router/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Local Development

### Prerequisites

- Java 21
- Maven or the included Maven wrapper
- Node.js and npm
- MySQL

### Backend

Create a MySQL database for the application and configure the backend environment for your local database and JWT secret.

```bash
cd backend
export JWT_SECRET=replace-with-a-secure-local-development-secret
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### Environment Variables

Backend configuration:

- `JWT_SECRET`
- Database URL
- Database Username
- Database Password

Frontend configuration:

- `VITE_API_BASE_URL`

### Frontend

Install dependencies and start the Vite development server.

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

If the backend runs on a different URL, configure the frontend API base URL through the appropriate local Vite environment variable.

## Authentication

EmployeeHub is designed as an internal enterprise application. Self-registration is intentionally not supported.

User accounts are provisioned by administrators or created during initial system setup. Local development requires an administrator account in the local database before login.

No default credentials are provided. Production deployments should use securely managed administrator credentials.

## Future Improvements

- User Management Module
- Attendance Management
- Leave Management
- Task Management
- Reports
- Notifications
- Docker-based local environment
- CI/CD pipeline

## License

MIT License
