# Samvid Backend API

A robust Node.js backend API for the Samvid Employee & Project Management System.

## Features

- **RESTful API** for Projects, Employees, and Assignments
- **JSON File Database** for simple data persistence
- **Input Validation** with comprehensive error handling
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Request Logging** for monitoring and debugging
- **Statistics Endpoints** for dashboard analytics

## Quick Start

### Installation

```bash
cd server
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/stats/summary` - Get project statistics

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/stats/summary` - Get employee statistics

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `GET /api/assignments/project/:projectId` - Get assignments by project
- `GET /api/assignments/employee/:employeeId` - Get assignments by employee
- `GET /api/assignments/stats/summary` - Get assignment statistics

## Data Models

### Project
```json
{
  "id": "string",
  "projectNumber": "string (numbers only)",
  "projectName": "string (letters and spaces only)",
  "budget": "string (numbers only)",
  "manHours": "string (numbers only)",
  "startDate": "ISO date string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Employee
```json
{
  "id": "string",
  "employeeNumber": "string (numbers only)",
  "employeeName": "string (letters and spaces only)",
  "designation": "string (letters and spaces only)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Assignment
```json
{
  "id": "string",
  "projectId": "string",
  "employeeId": "string",
  "activity": "string (Modeling|Drafting|Checking|Approval)",
  "date": "ISO date string",
  "startTime": "string (HH:MM format)",
  "endTime": "string (HH:MM format)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "count": 0
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - Comprehensive data validation
- **Error Handling** - Secure error responses

## Data Storage

Data is stored in JSON files in the `server/data/` directory:
- `projects.json` - Project data
- `employees.json` - Employee data
- `assignments.json` - Assignment data

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Development

The server uses Node.js with ES modules and includes:
- Hot reloading with `--watch` flag
- Comprehensive logging
- Error stack traces in development
- Input validation and sanitization

## Testing

Test the API using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example curl command:
```bash
curl -X GET http://localhost:3001/api/projects
```