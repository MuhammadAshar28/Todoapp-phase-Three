# Spec-3: REST API Completion & Ownership Enforcement - Implementation Plan

## Overview
This plan outlines the implementation approach for the complete REST API with ownership enforcement. The implementation will focus on creating secure, well-validated endpoints that enforce user ownership for all task operations.

## Architecture Design

### API Layer
- **FastAPI Framework**: Utilize FastAPI for automatic API documentation and validation
- **Dependency Injection**: Use FastAPI dependencies for authentication and ownership validation
- **Pydantic Schemas**: Define request/response schemas for validation
- **Error Handling**: Implement centralized error handling with consistent responses

### Business Logic Layer
- **Service Classes**: Create service classes for task operations
- **Ownership Validation**: Implement ownership checks in service methods
- **Business Logic**: Encapsulate business rules in service methods
- **Transaction Management**: Handle database transactions appropriately

### Data Access Layer
- **SQLModel Integration**: Use SQLModel for database operations
- **Ownership Filtering**: Apply user ID filters at the query level
- **Data Validation**: Validate data integrity at the model level
- **Relationship Management**: Handle user-task relationships properly

## Implementation Phases

### Phase 1: Foundation Setup
#### 1.1 API Structure Setup
- **Location**: `backend/src/api/v1/__init__.py`, `backend/src/api/v1/routers/__init__.py`
- **Implementation**:
  - Create API version 1 structure
  - Set up router organization
  - Configure API documentation
- **Dependencies**: FastAPI, existing models
- **Testing**: Verify API structure loads correctly

#### 1.2 Enhanced Task Models
- **Location**: `backend/src/models/task.py`
- **Implementation**:
  - Add relationship between Task and User models
  - Ensure proper indexing for performance
  - Add validation constraints
- **Dependencies**: SQLModel, Pydantic
- **Testing**: Verify model relationships work correctly

#### 1.3 API Schemas
- **Location**: `backend/src/api/schemas/task.py`
- **Implementation**:
  - Create request schemas (TaskCreate, TaskUpdate)
  - Create response schemas (TaskResponse, TaskListResponse)
  - Add validation rules and constraints
- **Dependencies**: Pydantic
- **Testing**: Verify schema validation works as expected

### Phase 2: Core CRUD Implementation
#### 2.1 Task Creation Endpoint
- **Location**: `backend/src/api/v1/routers/tasks.py`
- **Implementation**:
  - Create POST /tasks endpoint
  - Use authenticated user ID from dependency
  - Validate request data with Pydantic schema
  - Return created task with 201 status
- **Dependencies**: Authentication dependencies, Task service
- **Testing**: Test creation with valid/invalid data

#### 2.2 Task Retrieval Endpoints
- **Location**: `backend/src/api/v1/routers/tasks.py`
- **Implementation**:
  - Create GET /tasks endpoint with pagination
  - Create GET /tasks/{task_id} endpoint
  - Apply ownership filtering to queries
  - Validate path parameters
- **Dependencies**: Authentication dependencies, Task service
- **Testing**: Test retrieval with valid/invalid IDs and pagination

#### 2.3 Task Update Endpoints
- **Location**: `backend/src/api/v1/routers/tasks.py`
- **Implementation**:
  - Create PUT /tasks/{task_id} endpoint (full update)
  - Create PATCH /tasks/{task_id} endpoint (partial update)
  - Apply ownership validation before update
  - Validate request data with Pydantic schema
- **Dependencies**: Authentication dependencies, Task service
- **Testing**: Test updates with valid/invalid data and ownership

#### 2.4 Task Deletion Endpoint
- **Location**: `backend/src/api/v1/routers/tasks.py`
- **Implementation**:
  - Create DELETE /tasks/{task_id} endpoint
  - Apply ownership validation before deletion
  - Return appropriate status codes
- **Dependencies**: Authentication dependencies, Task service
- **Testing**: Test deletion with valid/invalid ownership

### Phase 3: Specialized Operations
#### 3.1 Task Completion Toggle
- **Location**: `backend/src/api/v1/routers/tasks.py`
- **Implementation**:
  - Create PATCH /tasks/{task_id}/complete endpoint
  - Implement toggle functionality for is_completed field
  - Apply ownership validation
- **Dependencies**: Authentication dependencies, Task service
- **Testing**: Test completion toggle functionality

#### 3.2 Advanced Query Parameters
- **Location**: `backend/src/api/v1/routers/tasks.py`
- **Implementation**:
  - Add support for filtering by completion status
  - Add pagination parameters with validation
  - Optimize queries for performance
- **Dependencies**: FastAPI query parameters, Task service
- **Testing**: Test filtering and pagination functionality

### Phase 4: Ownership Enforcement
#### 4.1 Service Layer Ownership Checks
- **Location**: `backend/src/services/task_service.py`
- **Implementation**:
  - Add ownership validation methods
  - Implement user-scoped queries
  - Add proper error handling for ownership violations
- **Dependencies**: Database models, authentication
- **Testing**: Test ownership enforcement at service level

#### 4.2 Database-Level Ownership
- **Location**: `backend/src/models/task.py`, `backend/src/database/session.py`
- **Implementation**:
  - Add user_id to all task queries
  - Implement row-level security patterns
  - Optimize queries with proper indexing
- **Dependencies**: SQLModel, database session
- **Testing**: Verify database-level ownership enforcement

#### 4.3 API-Level Ownership
- **Location**: `backend/src/api/v1/routers/tasks.py`
- **Implementation**:
  - Add ownership validation to all endpoints
  - Return appropriate error codes (403/404)
  - Implement consistent error responses
- **Dependencies**: Authentication dependencies, Task service
- **Testing**: Test API-level ownership enforcement

### Phase 5: Validation & Error Handling
#### 5.1 Request Validation
- **Location**: `backend/src/api/schemas/task.py`
- **Implementation**:
  - Add comprehensive validation rules
  - Implement custom validators where needed
  - Add error messages for validation failures
- **Dependencies**: Pydantic validation features
- **Testing**: Test all validation scenarios

#### 5.2 Response Validation
- **Location**: `backend/src/api/schemas/task.py`
- **Implementation**:
  - Define response schemas
  - Add serialization rules
  - Handle sensitive data masking
- **Dependencies**: Pydantic serialization
- **Testing**: Verify response formatting

#### 5.3 Error Handling
- **Location**: `backend/src/api/handlers/errors.py`, `backend/src/main.py`
- **Implementation**:
  - Create standardized error response format
  - Implement exception handlers
  - Add logging for error scenarios
- **Dependencies**: FastAPI exception handlers
- **Testing**: Test error scenarios and responses

## Technical Approach

### API Endpoint Implementation
```python
from fastapi import APIRouter, Depends, HTTPException, Query
from uuid import UUID

from src.auth.dependencies import get_current_user_id
from src.services.task_service import TaskService
from src.api.schemas.task import TaskCreate, TaskResponse, TaskListResponse

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(
    task_data: TaskCreate,
    current_user_id: str = Depends(get_current_user_id)
) -> TaskResponse:
    # Implementation with ownership validation
    pass
```

### Service Layer Pattern
```python
class TaskService:
    @staticmethod
    def create_task(user_id: UUID, task_data: TaskCreate) -> Task:
        # Ownership is implicitly handled by user_id parameter
        pass

    @staticmethod
    def get_task_for_user(user_id: UUID, task_id: UUID) -> Optional[Task]:
        # Filter by both user_id and task_id
        pass
```

### Ownership Validation
```python
def validate_task_ownership(user_id: UUID, task: Task) -> bool:
    if task.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Task does not belong to authenticated user"
        )
    return True
```

## Security Considerations

### Authentication Integration
- Integrate with existing JWT authentication system
- Extract user ID from validated tokens
- Validate tokens before processing requests

### Authorization Enforcement
- Validate ownership on every resource access
- Return 403/404 for unauthorized access attempts
- Never reveal existence of other users' resources

### Data Validation
- Validate all input parameters
- Sanitize data before database operations
- Prevent injection attacks

## Dependencies
- **Framework**: FastAPI for API definition and documentation
- **ORM**: SQLModel for database operations
- **Validation**: Pydantic for request/response validation
- **Authentication**: JWT-based authentication system
- **Database**: PostgreSQL with proper indexing

## Testing Strategy

### Unit Tests
- Test service layer methods individually
- Validate ownership enforcement logic
- Test error handling scenarios
- Verify data validation

### Integration Tests
- Test complete API workflows
- Validate authentication and authorization
- Test pagination and filtering
- Verify database operations

### Security Tests
- Test ownership bypass attempts
- Validate proper error responses
- Test authentication failures
- Verify data isolation

## Deployment Considerations

### Performance
- Implement proper database indexing
- Optimize queries for large datasets
- Add caching where appropriate
- Monitor API response times

### Monitoring
- Log authentication and authorization events
- Track API usage patterns
- Monitor error rates
- Alert on security violations

## Risk Analysis

### High-Risk Areas
- **Ownership Enforcement**: Flaws in ownership validation could allow cross-user access
- **Data Validation**: Insufficient validation could lead to data integrity issues
- **Error Handling**: Improper error responses could leak sensitive information

### Mitigation Strategies
- Implement ownership checks at multiple layers (API, service, database)
- Use comprehensive validation with clear error messages
- Follow security best practices for error responses
- Conduct thorough testing of all access patterns

## Success Metrics
- All CRUD endpoints function correctly with proper authentication
- Ownership enforcement prevents cross-user access
- API responses are consistent and follow defined schemas
- Error handling returns appropriate HTTP status codes
- Performance meets defined requirements (95% responses <500ms)
- All security requirements are satisfied