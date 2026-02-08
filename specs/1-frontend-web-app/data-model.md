# Data Model: Frontend Web Application

## User Session Entity

**Entity Name**: UserSession
**Description**: Represents the authenticated user's state, including their identity and authentication token

### Fields
- `id` (string): Unique session identifier
- `userId` (string): Reference to authenticated user ID from backend
- `token` (string): JWT token for API authentication
- `expiresAt` (Date): Token expiration timestamp
- `createdAt` (Date): Session creation timestamp
- `isActive` (boolean): Current session status

### Relationships
- Links to User entity from backend authentication system
- Associated with all authenticated API requests

### Validation Rules
- Token must be valid JWT format
- expiresAt must be in the future
- userId must correspond to valid user in system

### State Transitions
- `Active` → `Expired` when token expires
- `Active` → `Inactive` when user signs out
- `Inactive` → `Active` when user authenticates

## Task Entity (Client-Side Representation)

**Entity Name**: Task
**Description**: Represents a user's to-do item with title, description, completion status, and ownership

### Fields
- `id` (string): Unique task identifier from backend
- `userId` (string): Owner user ID (for validation)
- `title` (string): Task title (required, max 255 chars)
- `description` (string): Task description (optional, max 1000 chars)
- `isCompleted` (boolean): Completion status
- `createdAt` (Date): Task creation timestamp
- `updatedAt` (Date): Last modification timestamp

### Relationships
- Owned by User (via userId reference)
- Belongs to authenticated user's task collection

### Validation Rules
- Title is required and non-empty
- Title must be ≤ 255 characters
- Description must be ≤ 1000 characters
- userId must match authenticated user ID

### State Transitions
- `Pending` → `Completed` when marked complete
- `Completed` → `Pending` when marked incomplete
- `Any state` → `Deleted` when task is removed

## Authentication Token Entity

**Entity Name**: AuthToken
**Description**: JWT token used to authorize API requests and identify the user

### Fields
- `token` (string): Complete JWT token string
- `type` (string): Token type (e.g., "Bearer")
- `expiresIn` (number): Expiration time in seconds
- `scopes` (string[]): Authorized scopes (if applicable)

### Relationships
- Associated with UserSession entity
- Used in all authenticated API requests

### Validation Rules
- Token must be valid JWT format
- Must contain valid user identification claims
- Must not be expired
- Must have appropriate permissions for requested operations

### State Transitions
- `Valid` → `Expired` when expiration time reached
- `Valid` → `Invalid` when token is revoked or tampered with