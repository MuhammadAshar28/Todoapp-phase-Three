# Implementation Plan: Backend Core & Data Layer for Todo Full-Stack Web Application

**Branch**: `1-backend-core-data-layer` | **Date**: 2026-02-02 | **Spec**: [specs/1-backend-core-data-layer/spec.md](../specs/1-backend-core-data-layer/spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a FastAPI backend with Neon Serverless PostgreSQL for a todo application. This includes User and Task database models using SQLModel, async database connections, and REST API endpoints for task management with user isolation at the data level. The system will support all CRUD operations for tasks with proper user scoping to ensure users can only access their own tasks.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, asyncpg, uvicorn, Neon Serverless PostgreSQL
**Storage**: Neon Serverless PostgreSQL with SQLModel ORM
**Testing**: pytest for unit and integration tests
**Target Platform**: Linux server (deployable to cloud platforms)
**Project Type**: Web backend service
**Performance Goals**: Handle 1000 concurrent users, API responses under 500ms p95
**Constraints**: <200ms p95 for task operations, async database operations, secure user isolation
**Scale/Scope**: Multi-user support with proper data isolation, 10k+ users, 1M+ tasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the project constitution:
- ✅ Spec-driven development: Following the written specification exactly
- ✅ No manual coding: Using Qwen Code with approved specs and plans
- ✅ Separation of concerns: Backend clearly separated from frontend
- ✅ Security-first design: User isolation enforced at data layer
- ✅ Production realism: Architecture mirrors real-world full-stack systems
- ✅ Technology constraints: Using FastAPI, SQLModel, Neon PostgreSQL as specified
- ✅ Security standards: User data isolation enforced at query level

## Project Structure

### Documentation (this feature)

```text
specs/1-backend-core-data-layer/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py          # Task SQLModel
│   │   └── database.py      # Database connection
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── tasks.py     # Task CRUD endpoints
│   │   └── schemas/
│   │       ├── __init__.py
│   │       ├── task.py      # Pydantic schemas
│   │       └── errors.py    # Error response schemas
│   ├── main.py              # FastAPI app entry
│   └── config.py            # Environment configuration
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_crud.py         # CRUD operation tests
│   └── test_user_isolation.py
├── alembic/
│   └── versions/            # Database migrations
├── requirements.txt
├── .env.example
└── README.md
```

**Structure Decision**: Selected web application backend structure with modular organization by functionality (models, schemas, API endpoints) and clear separation of concerns. The backend directory contains all server-side code with proper async database handling and API endpoint organization.


## Phase 0: Research

### Research Findings

All technical decisions have been validated through research:

1. **SQLModel with Neon PostgreSQL**
   - Decision: Use SQLModel for unified SQL and Pydantic validation
   - Rationale: Native PostgreSQL support, type safety, migration compatibility
   - Alternative: Plain SQLAlchemy - rejected for added Pydantic integration

2. **FastAPI REST Patterns**
   - Decision: Follow standard REST conventions with dedicated error handlers
   - Rationale: Industry standard, automatic OpenAPI generation
   - Alternative: Custom routing - rejected for maintainability

3. **Error Handling Strategy**
   - Decision: Centralized exception handler with consistent error schemas
   - Rationale: Deterministic error responses, proper HTTP status codes
   - Alternative: Per-endpoint errors - rejected for consistency

4. **User Isolation via user_id**
   - Decision: Always filter queries by user_id column
   - Rationale: Prevents cross-user access, prepares for JWT auth
   - Alternative: Row-level security - rejected for portability

---

## Phase 1: Design & Contracts

### Database Schema

**Task Entity**
- `id`: UUID primary key (distributed uniqueness)
- `user_id`: UUID foreign key (user ownership)
- `title`: String(255), required, non-empty
- `description`: Text, nullable
- `is_completed`: Boolean, default False
- `created_at`: DateTime, auto-created
- `updated_at`: DateTime, auto-updated

**Indexes**: Primary key on id, foreign key on user_id, composite index on (user_id, created_at)

### API Endpoints

| Method | Path | Description | Status Codes |
|--------|------|-------------|--------------|
| POST | /users/{user_id}/tasks | Create task | 201, 400, 404 |
| GET | /users/{user_id}/tasks | List tasks | 200, 404 |
| GET | /users/{user_id}/tasks/{task_id} | Get task | 200, 404 |
| PUT/PATCH | /users/{user_id}/tasks/{task_id} | Update task | 200, 400, 404 |
| DELETE | /users/{user_id}/tasks/{task_id} | Delete task | 204, 404 |

### Error Response Schema

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {} // Optional validation details
  }
}
```

---

## Complexity Tracking

No constitution violations require justification.

---

## Artifacts Generated

- `research.md` - Technical research findings
- `data-model.md` - Database schema documentation
- `contracts/task-operations.yaml` - OpenAPI specification
- `contracts/error-responses.yaml` - Error schemas
- `quickstart.md` - Development setup guide

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multi-file structure | Scalability and maintainability | Single file would become unwieldy as features grow |
| Async database operations | Performance with concurrent users | Sync operations would block under load |

**Status**: Ready for `/sp.tasks` to generate implementation tasks