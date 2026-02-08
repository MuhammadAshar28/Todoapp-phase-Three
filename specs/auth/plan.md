# Spec-2: Authentication & API Security - Implementation Plan

## Overview
This plan details the implementation approach for JWT-based authentication and authorization across the system, covering Better Auth integration on the frontend and FastAPI backend security enforcement.

## Architecture Design

### Frontend Authentication Layer
- **Better Auth Configuration**: Configure JWT plugin with shared secret
- **Environment Variables**: Secure storage of JWT secrets
- **Token Management**: Handle token issuance, storage, and refresh

### Backend Security Layer
- **JWT Verification Middleware**: Intercept requests to validate tokens
- **User Identity Extraction**: Decode JWT claims to identify users
- **Route Protection**: Validate user_id matching for cross-user access prevention

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth/
│   │   ├── middleware.py    # JWT validation middleware
│   │   ├── dependencies.py  # Authentication dependencies
│   │   └── utils.py         # JWT utilities
│   ├── api/
│   │   ├── main.py          # Main FastAPI app
│   │   └── routes/
│   │       ├── auth.py      # Authentication endpoints
│   │       └── tasks.py     # Updated to require authentication
│   └── config/
│       └── settings.py      # Configuration with JWT secret
├── .env.example
└── requirements.txt
frontend/
├── src/
│   ├── lib/
│   │   └── auth.js          # Better Auth configuration
│   └── pages/
│       └── api/
│           └── auth/
│               └── [...nextauth].js  # NextAuth configuration
└── package.json
```

## Implementation Phases

### Phase 1: Infrastructure Setup
#### 1.1 Configure Better Auth JWT Plugin
- **Location**: `frontend/src/lib/auth.ts` or similar auth configuration file
- **Implementation**:
  - Install and enable Better Auth JWT plugin
  - Configure JWT algorithm (preferably RS256 or HS256)
  - Set token expiration times (access: 15 min, refresh: 7 days)
- **Dependencies**: Better Auth library, crypto libraries
- **Testing**: Verify token generation with proper claims

#### 1.2 Environment Variable Setup
- **Location**: `.env.local` (frontend), `.env` (backend)
- **Implementation**:
  - Define `JWT_SECRET` variable for both frontend and backend
  - Ensure secret is the same across both environments
  - Add to `.gitignore` to prevent committing secrets
- **Dependencies**: Environment variable management
- **Testing**: Verify secret loading in both environments

### Phase 2: Backend Security Implementation
#### 2.1 JWT Verification Middleware
- **Location**: `backend/middleware/auth_middleware.py`
- **Implementation**:
  - Create FastAPI dependency to verify JWT tokens
  - Use PyJWT or python-jose for token validation
  - Extract user identity from token claims
  - Return 401 for invalid/missing tokens
- **Dependencies**: PyJWT, FastAPI dependencies
- **Testing**: Unit tests for token validation scenarios

#### 2.2 User Identity Dependency
- **Location**: `backend/dependencies/auth.py`
- **Implementation**:
  - Create dependency to inject user identity into route handlers
  - Extract user_id, name, email from JWT claims
  - Raise HTTPException(401) for invalid tokens
- **Dependencies**: FastAPI Depends, JWT libraries
- **Testing**: Verify user identity injection in protected routes

#### 2.3 User ID Matching Enforcement
- **Location**: `backend/dependencies/user_validation.py`
- **Implementation**:
  - Create dependency to validate user_id in token matches URL param
  - Apply to routes that require user-specific data access
  - Return 403 for mismatched user IDs
- **Dependencies**: FastAPI path params, auth middleware
- **Testing**: Verify protection against cross-user data access

### Phase 3: Route Protection
#### 3.1 Protect Existing Routes
- **Location**: All existing protected routes in `backend/api/v1/`
- **Implementation**:
  - Add auth dependencies to existing routes
  - Update route signatures to accept user identity
  - Modify route logic to use authenticated user context
- **Dependencies**: All auth middleware components
- **Testing**: Verify all routes now require authentication

#### 3.2 Create New Authenticated Routes
- **Location**: `backend/api/v1/authenticated_routes.py`
- **Implementation**:
  - Define new routes that require authentication
  - Implement user-specific data access patterns
  - Follow consistent auth patterns across all routes
- **Dependencies**: All auth components
- **Testing**: Test new authenticated functionality

## Technical Approach

### Frontend Implementation Details
1. **Better Auth Configuration**:
   ```typescript
   import { betterAuth } from "better-auth";

   export const auth = betterAuth({
     // JWT configuration with shared secret
     jwt: {
       secret: process.env.JWT_SECRET,
       expiresIn: "15m"
     },
     // Additional auth config...
   });
   ```

2. **Token Handling**:
   - Store JWT in httpOnly cookies for security
   - Implement automatic token refresh
   - Add interceptors to include tokens in API requests

### Backend Implementation Details
1. **JWT Middleware**:
   ```python
   from fastapi import Depends, HTTPException, status
   from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
   import jwt

   security = HTTPBearer()

   async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
       try:
           payload = jwt.decode(
               credentials.credentials,
               JWT_SECRET,
               algorithms=["HS256"]
           )
           return payload
       except jwt.ExpiredSignatureError:
           raise HTTPException(status_code=401, detail="Token expired")
       except jwt.JWTError:
           raise HTTPException(status_code=401, detail="Invalid token")
   ```

2. **User ID Validation**:
   ```python
   def validate_user_access(token_user_id: str, url_user_id: str):
       if token_user_id != url_user_id:
           raise HTTPException(status_code=403, detail="Access denied")
   ```

## Security Considerations

### Token Security
- Use strong, randomly generated JWT secrets (at least 256 bits)
- Implement short-lived access tokens (15 minutes)
- Use refresh tokens for extended sessions (7 days)
- Store secrets in environment variables, never in code

### Validation Measures
- Validate token signature using shared secret
- Check token expiration on every request
- Verify user_id in token matches URL parameter
- Return appropriate HTTP status codes (401, 403)

### Error Handling
- Never expose sensitive information in error messages
- Log authentication failures for monitoring
- Implement rate limiting on auth endpoints

## Dependencies
- **Frontend**: Better Auth library, Next.js
- **Backend**: FastAPI, PyJWT or python-jose, cryptography
- **Environment**: Consistent JWT_SECRET across frontend and backend

## Testing Strategy

### Unit Tests
- JWT token validation functions
- User identity extraction
- User ID matching logic
- Error handling scenarios

### Integration Tests
- End-to-end authentication flow
- Protected route access
- Cross-user access prevention
- Token expiration handling

### Security Tests
- Invalid token rejection
- Expired token handling
- User ID spoofing attempts
- Missing authorization headers

## Deployment Considerations

### Environment Setup
- Securely provision JWT_SECRET to production
- Ensure consistent secret across all instances
- Implement proper logging for auth events

### Monitoring
- Track authentication success/failure rates
- Monitor for suspicious access patterns
- Alert on authentication system failures

## Risk Analysis

### High-Risk Areas
- **Secret Management**: Improper handling of JWT_SECRET could compromise entire auth system
- **User ID Validation**: Flaws in user_id matching could allow cross-user data access
- **Token Storage**: Insecure token storage could lead to token theft

### Mitigation Strategies
- Use infrastructure-as-code for secret provisioning
- Implement comprehensive validation tests
- Follow security best practices for token storage
- Regular security audits of auth implementation

## Success Metrics
- All API routes properly validate JWT tokens
- User identity reliably extracted from tokens
- Cross-user data access prevented by user_id validation
- Appropriate error responses for invalid tokens (401/403)
- No authentication-related security vulnerabilities