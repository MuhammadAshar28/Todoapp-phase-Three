---
name: database-skill
description: Design and manage databases including table creation, migrations, and scalable schema design using best practices.
---

# Database Skill

## Purpose

This skill is designed to generate **clean, scalable, and production-ready database designs** for modern applications.  
It focuses on **table creation**, **database migrations**, and **schema design** with performance, maintainability, and data integrity in mind.

---

## Instructions

### 1. Schema Design
- Identify entities and relationships clearly
- Normalize data to reduce redundancy
- Use appropriate data types
- Define primary keys and foreign keys
- Design for scalability and future changes

### 2. Table Creation
- Create tables with meaningful names
- Define constraints (NOT NULL, UNIQUE, DEFAULT)
- Apply indexes where necessary
- Enforce referential integrity
- Follow consistent naming conventions

### 3. Migrations
- Create versioned migration files
- Support up and down migrations
- Apply migrations safely without data loss
- Track schema changes over time
- Ensure migrations are reversible when possible

### 4. Relationships
- One-to-One relationships
- One-to-Many relationships
- Many-to-Many relationships
- Proper use of junction tables
- Cascade rules for updates and deletes

---

## Best Practices
- Use snake_case or camelCase consistently
- Avoid over-indexing
- Prefer UUIDs where applicable
- Keep migrations atomic and small
- Never edit old migrations in production
- Back up data before major schema changes

---
