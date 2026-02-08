# Spec-3: REST API Completion & Ownership Enforcement

## Overview
This specification defines the complete REST API behavior for the Todo application, with a focus on CRUD operations for tasks and strict ownership enforcement. The API will ensure that authenticated users can only access and modify their own tasks.

## Requirements

### Functional Requirements
- **REQ-API-001**: The system SHALL provide full CRUD operations for tasks (Create, Read, Update, Delete)
- **REQ-API-002**: The system SHALL support task completion toggling functionality
- **REQ-API-003**: The system SHALL enforce ownership using authenticated user identity
- **REQ-API-004**: The system SHALL validate all incoming requests against defined schemas
- **REQ-API-005**: The system SHALL return consistent response formats for all operations
- **REQ-API-006**: The system SHALL return appropriate HTTP status codes for all operations
- **REQ-API-007**: The system SHALL filter all queries by authenticated user ID
- **REQ-API-008**: The system SHALL return 403 or 404 for unauthorized access attempts

### Security Requirements
- **SEC-API-001**: Authenticated user can access only their own tasks
- **SEC-API-002**: All queries must be filtered by authenticated user ID
- **SEC-API-003**: Unauthorized access attempts return 403 or 404
- **SEC-API-004**: All endpoints require valid authentication tokens
- **SEC-API-005**: User ID from token must match the requested resource ownership

### Performance Requirements
- **PERF-API-001**: API responses shall be delivered within 500ms for 95% of requests
- **PERF-API-002**: Pagination shall be supported for collections with more than 20 items
- **PERF-API-003**: Database queries shall be optimized to prevent N+1 problems

## API Endpoints

### Task Operations

#### POST /api/v1/tasks
- **Purpose**: Create a new task for the authenticated user
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "string (required, max 255)",
    "description": "string (optional, max 1000)",
    "is_completed": "boolean (optional, default false)"
  }
  ```
- **Response**:
  - `201 Created`: Task created successfully
    ```json
    {
      "id": "uuid",
      "user_id": "uuid (authenticated user)",
      "title": "string",
      "description": "string",
      "is_completed": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```
  - `400 Bad Request`: Invalid request data
  - `401 Unauthorized`: Invalid or missing authentication token
- **Behavior**: Creates a new task associated with the authenticated user ID

#### GET /api/v1/tasks
- **Purpose**: Retrieve all tasks for the authenticated user with pagination
- **Authentication**: Required
- **Query Parameters**:
  - `page`: integer (default 1, min 1)
  - `page_size`: integer (default 20, min 1, max 100)
  - `completed`: boolean (optional, filter by completion status)
- **Response**:
  - `200 OK`: Tasks retrieved successfully
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "user_id": "uuid",
          "title": "string",
          "description": "string",
          "is_completed": "boolean",
          "created_at": "datetime",
          "updated_at": "datetime"
        }
      ],
      "total": "integer",
      "page": "integer",
      "page_size": "integer",
      "total_pages": "integer"
    }
    ```
  - `401 Unauthorized`: Invalid or missing authentication token
- **Behavior**: Returns only tasks belonging to the authenticated user

#### GET /api/v1/tasks/{task_id}
- **Purpose**: Retrieve a specific task by ID
- **Authentication**: Required
- **Path Parameters**:
  - `task_id`: uuid (required)
- **Response**:
  - `200 OK`: Task retrieved successfully
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "string",
      "description": "string",
      "is_completed": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```
  - `401 Unauthorized`: Invalid or missing authentication token
  - `403 Forbidden`: Task does not belong to authenticated user
  - `404 Not Found`: Task not found
- **Behavior**: Returns the task only if it belongs to the authenticated user

#### PUT /api/v1/tasks/{task_id}
- **Purpose**: Update a specific task completely
- **Authentication**: Required
- **Path Parameters**:
  - `task_id`: uuid (required)
- **Request Body**:
  ```json
  {
    "title": "string (required, max 255)",
    "description": "string (optional, max 1000)",
    "is_completed": "boolean"
  }
  ```
- **Response**:
  - `200 OK`: Task updated successfully
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "string",
      "description": "string",
      "is_completed": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```
  - `400 Bad Request`: Invalid request data
  - `401 Unauthorized`: Invalid or missing authentication token
  - `403 Forbidden`: Task does not belong to authenticated user
  - `404 Not Found`: Task not found
- **Behavior**: Updates the task only if it belongs to the authenticated user

#### PATCH /api/v1/tasks/{task_id}
- **Purpose**: Update a specific task partially
- **Authentication**: Required
- **Path Parameters**:
  - `task_id`: uuid (required)
- **Request Body**:
  ```json
  {
    "title": "string (optional, max 255)",
    "description": "string (optional, max 1000)",
    "is_completed": "boolean (optional)"
  }
  ```
- **Response**:
  - `200 OK`: Task updated successfully
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "string",
      "description": "string",
      "is_completed": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```
  - `400 Bad Request`: Invalid request data
  - `401 Unauthorized`: Invalid or missing authentication token
  - `403 Forbidden`: Task does not belong to authenticated user
  - `404 Not Found`: Task not found
- **Behavior**: Updates the task only if it belongs to the authenticated user

#### DELETE /api/v1/tasks/{task_id}
- **Purpose**: Delete a specific task
- **Authentication**: Required
- **Path Parameters**:
  - `task_id`: uuid (required)
- **Response**:
  - `204 No Content`: Task deleted successfully
  - `401 Unauthorized`: Invalid or missing authentication token
  - `403 Forbidden`: Task does not belong to authenticated user
  - `404 Not Found`: Task not found
- **Behavior**: Deletes the task only if it belongs to the authenticated user

#### PATCH /api/v1/tasks/{task_id}/complete
- **Purpose**: Toggle the completion status of a task
- **Authentication**: Required
- **Path Parameters**:
  - `task_id`: uuid (required)
- **Response**:
  - `200 OK`: Task completion status toggled successfully
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "string",
      "description": "string",
      "is_completed": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```
  - `401 Unauthorized`: Invalid or missing authentication token
  - `403 Forbidden`: Task does not belong to authenticated user
  - `404 Not Found`: Task not found
- **Behavior**: Toggles the completion status of the task only if it belongs to the authenticated user

## Ownership Enforcement Rules

### User Identity Extraction
- **RULE-OWN-001**: The system SHALL extract user identity from the JWT token on every authenticated request
- **RULE-OWN-002**: The system SHALL validate that the extracted user ID matches the required ownership criteria
- **RULE-OWN-003**: The system SHALL reject requests where user ID validation fails

### Query Filtering
- **RULE-FILTER-001**: All GET operations SHALL filter results by the authenticated user ID
- **RULE-FILTER-002**: Individual resource GET operations SHALL verify ownership before returning data
- **RULE-FILTER-003**: Modification operations SHALL verify ownership before performing changes

### Access Control
- **RULE-ACCESS-001**: The system SHALL return 403 Forbidden when a user attempts to access another user's resource
- **RULE-ACCESS-002**: The system SHALL return 404 Not Found for consistency when ownership validation fails
- **RULE-ACCESS-003**: The system SHALL not leak information about the existence of other users' resources

## Request Validation

### Schema Validation
- **VALIDATION-001**: All request bodies SHALL be validated against defined Pydantic schemas
- **VALIDATION-002**: All path parameters SHALL be validated for correct type and format
- **VALIDATION-003**: All query parameters SHALL be validated for correct type and range

### Business Logic Validation
- **VALIDATION-004**: Task titles SHALL be required and non-empty
- **VALIDATION-005**: Task titles SHALL not exceed 255 characters
- **VALIDATION-006**: Task descriptions SHALL not exceed 1000 characters
- **VALIDATION-007**: Pagination parameters SHALL be validated for minimum and maximum values

## Response Formats

### Success Responses
- **RESPONSE-001**: All successful responses SHALL follow the defined schema format
- **RESPONSE-002**: Collection responses SHALL include pagination metadata
- **RESPONSE-003**: Resource responses SHALL include timestamps and identifiers

### Error Responses
- **RESPONSE-004**: Error responses SHALL follow the standard error format:
  ```json
  {
    "error_code": "string",
    "message": "string",
    "details": "object (optional)"
  }
  ```
- **RESPONSE-005**: Error responses SHALL include appropriate HTTP status codes
- **RESPONSE-006**: Error messages SHALL be user-friendly but not reveal sensitive information

## HTTP Status Codes

### Success Codes
- **200 OK**: Request successful, resource returned
- **201 Created**: Resource created successfully
- **204 No Content**: Request successful, no content to return

### Client Error Codes
- **400 Bad Request**: Invalid request data or parameters
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Access denied due to insufficient permissions
- **404 Not Found**: Resource not found or access denied due to ownership

### Server Error Codes
- **500 Internal Server Error**: Unexpected server error

## Security Considerations

### Authentication Validation
- **SECURITY-001**: All endpoints SHALL validate authentication tokens
- **SECURITY-002**: Invalid tokens SHALL result in 401 responses
- **SECURITY-003**: Expired tokens SHALL result in 401 responses

### Authorization Validation
- **SECURITY-004**: All endpoints SHALL validate resource ownership
- **SECURITY-005**: Ownership mismatches SHALL result in 403 or 404 responses
- **SECURITY-006**: User isolation SHALL be maintained at the database level

## Out of Scope
- Frontend UI and presentation
- Authentication token issuance
- Advanced search and filtering capabilities beyond basic requirements
- Real-time notifications or WebSocket functionality
- File upload or attachment functionality

## Acceptance Criteria
- [ ] All documented endpoints function correctly
- [ ] Task ownership is enforced on every operation
- [ ] API responses are consistent and predictable
- [ ] Request validation prevents invalid data from being processed
- [ ] Error handling returns appropriate HTTP status codes
- [ ] Pagination works correctly for large datasets
- [ ] Cross-user access is prevented at all levels
- [ ] API performance meets defined requirements
- [ ] Authentication and authorization work as specified
- [ ] Response formats are consistent across all endpoints

## Dependencies
- Authentication system (JWT-based)
- Database with user and task models
- FastAPI framework for endpoint definition
- Pydantic for request/response validation
- SQLModel for database operations