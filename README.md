# EmployeeHub

## Project Overview

EmployeeHub is a full-stack internal workforce management platform built with Spring Boot and React. It provides JWT-authenticated access for managing employees, departments, user profiles, and workforce dashboard data. Version 1.0 focuses on employee administration, department management, authentication, and a modular backend architecture.

## Features

### Authentication

- JWT-based login
- Role-based authorization
- Authenticated user profile
- Profile update
- Change password

### Employee Management

- Employee create, read, update, and delete operations
- Employee detail view
- Search by keyword
- Filter by department and status
- Sortable employee list
- Paginated employee list

### Department Management

- Department create, read, update, and delete operations
- Department list and detail support

### Dashboard

- Workforce summary metrics
- Recent employee information

### System

- Global exception handling
- Unauthenticated health check endpoint for deployment monitoring
- Responsive React user interface

## Technology Stack

### Backend

- Java 21
- Spring Boot 3.3.5
- Spring Security
- Spring Data JPA (Hibernate)
- MySQL
- Maven Wrapper
- JWT Authentication
- BCrypt Password Encoding
- Docker

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

### Deployment

- Render for the Spring Boot backend
- Vercel for the React + Vite frontend
- Aiven MySQL for the managed database

## Project Architecture

EmployeeHub uses a layered backend architecture with domain-oriented package organization.

- **Controller**: Defines REST endpoints and delegates application operations to services.
- **Service**: Handles business logic, validation rules, authorization-sensitive operations, and transaction boundaries.
- **Repository**: Provides persistence access through Spring Data JPA.
- **DTO**: Defines request and response contracts for API communication.
- **Entity**: Represents persisted domain models mapped to database tables.

The frontend is organized around pages, reusable components, routing, authentication state, and API client utilities.

## Project Structure

```text
.
├── backend/
│   ├── Dockerfile
│   ├── src/main/java/com/employeehub/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dashboard/
│   │   ├── department/
│   │   ├── employee/
│   │   ├── exception/
│   │   └── security/
│   ├── src/main/resources/
│   ├── mvnw
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── router/
│   ├── package.json
│   └── vite.config.js
├── LICENSE
└── README.md
```

## REST API Overview

Base API path:

```text
/api
```

### Health

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/health` | Health check for deployment monitoring | Public |

### Authentication and Profile

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/login` | Authenticate a user and return a JWT | Public |
| GET | `/api/auth/profile` | Get the current authenticated user's profile | Required |
| PUT | `/api/auth/profile` | Update the current authenticated user's profile | Required |
| PUT | `/api/auth/profile/password` | Change the current authenticated user's password | Required |

### Dashboard

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/dashboard` | Get workforce summary metrics | Admin |

### Employees

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/employees` | List employees with search, filtering, sorting, and pagination | Admin |
| GET | `/api/employees/{id}` | Get an employee by ID | Admin |
| POST | `/api/employees` | Create an employee | Admin |
| PUT | `/api/employees/{id}` | Update an employee | Admin |
| DELETE | `/api/employees/{id}` | Delete an employee | Admin |

Supported employee list query parameters:

```text
keyword
department
status
page
size
sort
direction
```

### Departments

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/departments` | List departments | Admin or Employee |
| GET | `/api/departments/{id}` | Get a department by ID | Admin or Employee |
| POST | `/api/departments` | Create a department | Admin |
| PUT | `/api/departments/{id}` | Update a department | Admin |
| DELETE | `/api/departments/{id}` | Delete a department | Admin |

## Local Development

### Prerequisites

- Java 21
- Maven Wrapper from the backend project
- Node.js and npm
- MySQL

### Backend

Create a local MySQL database and configure the required environment variables.

```bash
cd backend
export JWT_SECRET=replace-with-a-secure-local-development-secret
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

The application reads the following backend configuration from environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
DB_INIT_FAIL_TIMEOUT
JPA_DDL_AUTO
HIBERNATE_JDBC_METADATA_ACCESS
SERVER_PORT
FRONTEND_URL
JWT_SECRET
JWT_EXPIRATION_MS
```

If no administrator account exists, the backend automatically initializes a default administrator account during application startup. This simplifies the initial deployment and development setup. Change the password after first login when using a non-local environment.

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

The frontend uses the following environment variable for API requests:

```text
VITE_API_BASE_URL
```

For local development, the frontend falls back to:

```text
http://localhost:8080/api
```

## Deployment

EmployeeHub has been successfully deployed with the following production setup:

- React + Vite frontend hosted on Vercel
- Spring Boot backend hosted on Render
- Aiven MySQL as the external managed database

Runtime secrets and database credentials are provided through environment variables and are not hardcoded in the project.

Required backend deployment variables include:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
FRONTEND_URL
JWT_SECRET
JPA_DDL_AUTO
```

Required frontend deployment variable:

```text
VITE_API_BASE_URL
```

The `/health` endpoint is available for Render health checks and returns `OK` without authentication.

## Future Enhancements

- User Management Module
- Attendance Management
- Leave Management
- Task Management
- Reports
- Notifications
- Docker-based local environment
- CI/CD pipeline

## License

This project is licensed under the MIT License. See `LICENSE` for details.
