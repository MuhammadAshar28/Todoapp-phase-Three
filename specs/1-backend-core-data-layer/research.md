# Research: Backend Core & Data Layer for Todo Full-Stack Web Application

**Feature**: Backend Core & Data Layer for Todo Full-Stack Web Application
**Date**: 2026-02-02

## Overview

This research document captures technical decisions and findings for implementing the backend core and data layer for the todo application. All unknowns from the technical context have been resolved through research and analysis.

## Decision Log

### 1. Database Choice: Neon Serverless PostgreSQL

**Decision**: Use Neon Serverless PostgreSQL as the primary database

**Rationale**:
- Serverless architecture provides automatic scaling and reduced costs
- Full PostgreSQL compatibility ensures robust feature set
- Built-in branching feature enables easy development environments
- Strong async support through asyncpg driver
- Good integration with Python ecosystem via SQLModel

**Alternatives considered**:
- SQLite: Too limited for multi-user application
- MongoDB: Would require different data modeling approach
- Traditional PostgreSQL: Requires manual scaling and management overhead

### 2. ORM Choice: SQLModel

**Decision**: Use SQLModel as the ORM for database operations

**Rationale**:
- Combines SQLAlchemy and Pydantic features in one library
- Excellent support for async operations
- Type hints and validation built-in
- Designed specifically for FastAPI applications
- Maintained by the same author as FastAPI (Sebastián Ramírez)

**Alternatives considered**:
- SQLAlchemy Core: More verbose, lacks Pydantic integration
- Tortoise ORM: Good async support but smaller community
- Peewee: Simpler but less feature-rich for complex queries

### 3. Framework Choice: FastAPI

**Decision**: Use FastAPI as the web framework

**Rationale**:
- Automatic API documentation generation (Swagger/OpenAPI)
- Built-in async support
- Strong typing with Pydantic integration
- High performance comparable to Node.js and Go frameworks
- Excellent validation and serialization capabilities
- Great ecosystem for building APIs

**Alternatives considered**:
- Flask: Requires more boilerplate for API development
- Django: Overkill for simple API backend
- Starlette: Lower-level than needed, FastAPI builds on top of it

### 4. API Design: RESTful Endpoints with User Scoping

**Decision**: Implement RESTful API endpoints with user_id in path for scoping

**Rationale**:
- Clear separation of user data at the API level
- Standard REST patterns familiar to developers
- Easy to implement user isolation in database queries
- Supports all required CRUD operations for tasks
- Follows common patterns for multi-tenant applications

**Endpoints**:
- GET /api/{user_id}/tasks - Retrieve all tasks for a user
- POST /api/{user_id}/tasks - Create a new task for a user
- GET /api/{user_id}/tasks/{id} - Retrieve a specific task for a user
- PUT /api/{user_id}/tasks/{id} - Update a specific task for a user
- DELETE /api/{user_id}/tasks/{id} - Delete a specific task for a user
- PATCH /api/{user_id}/tasks/{id}/complete - Toggle task completion status

### 5. Data Modeling: User and Task Models with Foreign Key Relationships

**Decision**: Implement User and Task models with proper foreign key relationships

**Rationale**:
- Enforces data integrity at the database level
- Enables efficient queries with JOIN operations
- Supports user isolation through foreign key constraints
- Allows for future expansion with additional related entities
- Follows standard relational database design patterns

**Model Attributes**:
- User: id, email, created_at, updated_at
- Task: id, user_id (foreign key), title, description, is_completed, created_at, updated_at

### 6. Async Operations: Database Connection and API Handling

**Decision**: Implement fully asynchronous database operations and API handlers

**Rationale**:
- Better performance under concurrent load
- Efficient resource utilization
- Matches modern Python web development practices
- FastAPI's async support makes this straightforward
- Essential for handling multiple concurrent users efficiently

## Best Practices Resolved

### Error Handling
- Use appropriate HTTP status codes (200, 201, 400, 404, 500)
- Return consistent error response format
- Validate input data before database operations
- Handle database connection failures gracefully

### Security
- Enforce user isolation at the database query level
- Validate user_id in all API endpoints
- Prevent cross-user data access through proper query filtering
- Use parameterized queries to prevent SQL injection

### Performance
- Use async database operations throughout
- Implement proper indexing on user_id and task_id columns
- Consider pagination for list endpoints in future iterations
- Optimize database queries to minimize round trips

## Implementation Patterns

### Dependency Injection
- Use FastAPI's dependency injection system for database sessions
- Centralize database connection management
- Enable easy testing with mock dependencies

### Validation
- Leverage Pydantic models for request/response validation
- Validate required fields (e.g., task title) at the API boundary
- Use SQLModel validation for database-level constraints

### Testing Strategy
- Unit tests for models and utility functions
- Integration tests for API endpoints
- Use test database with fixture data
- Mock external dependencies where appropriate


## Environment Configuration

**Decision**: Use environment variables for all secrets and connections

**Required Variables**:
- `DATABASE_URL`: Neon PostgreSQL connection string
- `API_HOST`: Host to bind (default: 0.0.0.0)
- `API_PORT`: Port to listen (default: 8000)
- `DEBUG`: Enable debug mode (default: false)
- `LOG_LEVEL`: Logging verbosity (default: info)

**Best Practices Applied**:
- `.env.example` documents all required variables
- No hard-coded values in source code
- Type validation via Pydantic Settings


## Pagination Strategy

**Decision**: Offset-based pagination with configurable limits

**Rationale**:
- Simple implementation and understanding
- Works with all database backends
- Predictable URL structure for caching

**Parameters**:
- `page`: 1-based page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

**Response Schema**:
```json
{
  "items": [...],
  "total": 123,
  "page": 1,
  "page_size": 20,
  "total_pages": 7
}
```

## User Isolation via user_id

**Decision**: Always filter queries by user_id column

**Rationale**:
- Simple and effective multi-user isolation
- Works seamlessly with future JWT authentication
- No risk of accidentally exposing other users' data
- Database-level enforcement via WHERE clauses

**Implementation Pattern**:
```python
# Always include user_id filter
tasks = session.exec(
    select(Task).where(Task.user_id == user_id)
).all()
```

**Security Considerations**:
- Never trust user_id from request body - only from path parameter
- Validate user_id format (UUID) before query execution
- Log any access attempts for audit trail

**Best Practices Applied**:
- Composite queries filter by (user_id, task_id) for single-task operations
- Soft delete pattern for recovery (optional)
- Index on user_id for query performance

