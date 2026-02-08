# API Contracts: Frontend Web Application

## Authentication Endpoints

### POST /api/auth/register
**Description**: Register a new user account

**Request**:
```
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com"
  },
  "token": "jwt-token-string"
}
```

**Response (400)**:
```
{
  "error": "Invalid input data",
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

### POST /api/auth/login
**Description**: Authenticate user and return JWT token

**Request**:
```
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com"
  },
  "token": "jwt-token-string"
}
```

**Response (401)**:
```
{
  "error": "Invalid credentials"
}
```

### POST /api/auth/logout
**Description**: Terminate user session

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Response (200)**:
```
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
**Description**: Get current user profile

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Response (200)**:
```
{
  "id": "uuid-string",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Response (401)**:
```
{
  "error": "Unauthorized"
}
```

## Task Management Endpoints

### GET /api/tasks
**Description**: Retrieve user's tasks with pagination

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Query Parameters**:
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `completed` (optional, boolean)

**Response (200)**:
```
{
  "items": [
    {
      "id": "uuid-string",
      "userId": "user-uuid",
      "title": "Task title",
      "description": "Task description",
      "isCompleted": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Response (401)**:
```
{
  "error": "Unauthorized"
}
```

### POST /api/tasks
**Description**: Create a new task

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Request**:
```
{
  "title": "New task title",
  "description": "Task description",
  "isCompleted": false
}
```

**Response (201)**:
```
{
  "id": "uuid-string",
  "userId": "user-uuid",
  "title": "New task title",
  "description": "Task description",
  "isCompleted": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Response (400)**:
```
{
  "error": "Validation failed",
  "details": {
    "title": "Title is required"
  }
}
```

**Response (401)**:
```
{
  "error": "Unauthorized"
}
```

### GET /api/tasks/{id}
**Description**: Retrieve a specific task

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Response (200)**:
```
{
  "id": "uuid-string",
  "userId": "user-uuid",
  "title": "Task title",
  "description": "Task description",
  "isCompleted": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Response (401)**:
```
{
  "error": "Unauthorized"
}
```

**Response (404)**:
```
{
  "error": "Task not found"
}
```

### PUT /api/tasks/{id}
**Description**: Update an entire task

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Request**:
```
{
  "title": "Updated task title",
  "description": "Updated task description",
  "isCompleted": true
}
```

**Response (200)**:
```
{
  "id": "uuid-string",
  "userId": "user-uuid",
  "title": "Updated task title",
  "description": "Updated task description",
  "isCompleted": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

**Response (400)**:
```
{
  "error": "Validation failed",
  "details": {
    "title": "Title is required"
  }
}
```

**Response (401)**:
```
{
  "error": "Unauthorized"
}
```

**Response (404)**:
```
{
  "error": "Task not found"
}
```

### PATCH /api/tasks/{id}
**Description**: Partially update a task

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Request**:
```
{
  "title": "Partially updated title",
  "isCompleted": true
}
```

**Response (200)**:
```
{
  "id": "uuid-string",
  "userId": "user-uuid",
  "title": "Partially updated title",
  "description": "Original description",
  "isCompleted": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

**Response (400)**:
```
{
  "error": "Validation failed",
  "details": {
    "title": "Title is too long"
  }
}
```

**Response (401)**:
```
{
  "error": "Unauthorized"
}
```

**Response (404)**:
```
{
  "error": "Task not found"
}
```

### DELETE /api/tasks/{id}
**Description**: Delete a specific task

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Response (204)**: No content

**Response (401)**:
```
{
  "error": "Unauthorized"
}
```

**Response (404)**:
```
{
  "error": "Task not found"
}
```

### PATCH /api/tasks/{id}/complete
**Description**: Toggle task completion status

**Headers**:
```
Authorization: Bearer {jwt-token}
```

**Response (200)**:
```
{
  "id": "uuid-string",
  "userId": "user-uuid",
  "title": "Task title",
  "description": "Task description",
  "isCompleted": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

**Response (401)**:
```
{
  "error": "Unauthorized"
}
```

**Response (404)**:
```
{
  "error": "Task not found"
}
```