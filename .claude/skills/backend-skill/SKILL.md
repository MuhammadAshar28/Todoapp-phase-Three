---
name: backend-skill
description: Build scalable backend systems by generating API routes, handling requests and responses, and connecting to databases using best practices.
---

# Backend Skill

## Purpose

This skill is designed to generate **clean, scalable, and production-ready backend code** for modern applications.  
It focuses on **API route generation**, **request/response handling**, and **database connectivity** with proper structure and best practices.

---

## Instructions

### 1. Route Generation
- Create RESTful API routes
- Use meaningful and consistent route naming
- Separate routes by resource/domain
- Support CRUD operations (Create, Read, Update, Delete)
- Apply middleware where necessary

### 2. Request Handling
- Parse and validate incoming requests
- Handle query parameters, route params, and request bodies
- Sanitize user input
- Support JSON request formats
- Handle async operations correctly

### 3. Response Handling
- Return appropriate HTTP status codes
- Use consistent response structures
- Handle success and error responses cleanly
- Avoid leaking internal error details
- Support pagination and filtering where applicable

### 4. Database Connection
- Establish a reliable database connection
- Reuse database clients efficiently
- Handle connection errors gracefully
- Close connections properly when required
- Support environment-based configuration

---

## Best Practices
- Use layered architecture (routes, controllers, services)
- Keep business logic out of route files
- Centralize error handling
- Use environment variables for configuration
- Log errors responsibly
- Follow REST and HTTP standards

---
