---
name: auth-skill
description: Build secure authentication systems including sign up, sign in, password hashing, JWT authentication, and Better Auth integration.
---

# Authentication Skill

## Purpose

This skill is designed to generate **secure, production-ready authentication code** for modern web applications.  
It covers **user registration**, **user login**, **password security**, **JWT-based authentication**, and **Better Auth integration** using best practices.

---

## Instructions

### 1. User Registration (Sign Up)
- Validate user inputs (email, username, password)
- Enforce strong password policies
- Prevent duplicate users
- Hash passwords before storage
- Store user records securely in the database

### 2. User Login (Sign In)
- Authenticate users using email/username and password
- Compare hashed passwords securely
- Handle invalid credentials safely
- Issue authentication tokens on success

### 3. Password Hashing
- Use industry-standard hashing algorithms (bcrypt or argon2)
- Always apply salting
- Never store or log plain-text passwords
- Support secure password updates

### 4. JWT Authentication
- Generate JWT access tokens after successful login
- Include only minimal, non-sensitive payload data
- Set expiration times for tokens
- Verify JWTs for protected routes
- Support refresh tokens when required

### 5. Better Auth Integration
- Integrate Better Auth for authentication flow
- Configure sessions, cookies, and callbacks
- Secure token and session storage
- Handle logout and session invalidation properly

---

## Security Best Practices
- Use HTTPS for all authentication routes
- Apply rate limiting to prevent brute-force attacks
- Return generic error messages
- Store secrets in environment variables
- Rotate secrets periodically
- Follow OWASP authentication guidelines

---
