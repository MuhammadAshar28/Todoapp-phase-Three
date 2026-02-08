# Quickstart Guide: Frontend Web Application

## Prerequisites
- Node.js 18+ installed on your system
- Backend API running and accessible
- Git for version control

## Setup Instructions

### 1. Clone and Navigate
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the environment template and configure your settings:
```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: URL of your backend API (e.g., http://localhost:8000)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: URL for Better Auth (usually same as API URL)

### 4. Start Development Server
```bash
npm run dev
```

Your frontend will be available at http://localhost:3000

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run linting checks (if configured) |

## Key Integration Points

### Authentication Integration
- Better Auth is configured in `src/lib/auth.ts`
- Session state is managed automatically
- JWT tokens are attached to API requests automatically

### API Client Usage
- All API calls go through the authenticated client in `src/lib/api.ts`
- Authentication headers are added automatically
- Error handling is centralized

### Protected Routes
- Pages in the `(dashboard)` route group are protected
- AuthGuard wrapper checks for valid session
- Unauthenticated users are redirected to sign-in

## Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Protected routes
│   │   ├── api/               # API route handlers
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # Utilities and API client
│   │   └── hooks/             # Custom React hooks
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
└── .env.local               # Environment variables
```

## Testing the Application

1. Visit http://localhost:3000
2. Register a new account or sign in with existing credentials
3. Verify you can access the dashboard
4. Test creating, updating, and deleting tasks
5. Confirm responsive behavior on different screen sizes