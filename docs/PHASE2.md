# Phase 2 Implementation Guide

## Overview

This document describes the Phase 2 implementation of Draw2Data, which transitions the project from a static MVP to a full web platform with user authentication, project persistence, and API backend.

## Architecture

### Monorepo Structure

The project now uses npm workspaces to manage multiple packages:

```
Draw2Data/
├── apps/
│   ├── frontend/    # React + TypeScript (Vite)
│   ├── backend/     # Node.js + Express + TypeScript
│   └── web/         # Phase 1 legacy (static site)
├── package.json     # Root workspace configuration
└── docs/
```

### Frontend (React + TypeScript)

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI**: Custom CSS with responsive design
- **State Management**: React Hooks (useState)
- **Port**: 5173

#### Key Features
- User authentication UI (login/register)
- Dashboard with project management
- Responsive layout
- Dark theme with gradient accents

### Backend (Node.js + Express)

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (to be implemented)
- **Port**: 3000

#### API Endpoints

##### Health Check
```
GET /api/health
Response: { status, phase, message, timestamp }
```

##### Authentication
```
POST /api/auth/register
Body: { email, password }
Response: { message, user }

POST /api/auth/login
Body: { email, password }
Response: { message, token, user }
```

##### Projects
```
GET /api/projects
Response: { projects, message }

POST /api/projects
Body: { name, description }
Response: { message, project }
```

##### Simulations
```
POST /api/simulations
Body: { projectId, drawingData }
Response: { message, simulationId, status }
```

## Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Install all dependencies (root + workspaces)
npm install
```

### Running Development Servers

```bash
# Run both frontend and backend simultaneously
npm run dev

# Or run individually
npm run dev:frontend  # Frontend only on port 5173
npm run dev:backend   # Backend only on port 3000
```

### Building for Production

```bash
# Build all workspaces
npm run build

# Build individual apps
cd apps/frontend && npm run build
cd apps/backend && npm run build
```

## What's Implemented

✅ **Infrastructure**
- Monorepo setup with npm workspaces
- React + TypeScript frontend with Vite
- Node.js + Express backend with TypeScript
- Development and build scripts

✅ **Frontend**
- Authentication UI (login page)
- Dashboard layout
- Responsive design
- Dark theme with modern UI

✅ **Backend**
- Express server setup
- REST API structure
- CORS configuration
- Mock authentication endpoints
- Mock project endpoints
- Mock simulation endpoints

## What's Next (To Be Implemented)

### Database Integration
- [ ] Set up PostgreSQL database
- [ ] Create database schema (users, projects, simulations)
- [ ] Implement database migrations
- [ ] Add database connection pooling

### Real Authentication
- [ ] Implement bcrypt password hashing
- [ ] Generate and verify JWT tokens
- [ ] Add authentication middleware
- [ ] Implement OAuth2 (Google, GitHub)

### Project Persistence
- [ ] Save/load drawing data
- [ ] Store project metadata
- [ ] Implement project CRUD operations
- [ ] Add file upload for project assets

### Canvas Drawing (Phase 1 Migration)
- [ ] Migrate canvas drawing logic from Phase 1
- [ ] Integrate with React component
- [ ] Connect drawing data to backend API
- [ ] Save drawing state to database

### Simulation Worker
- [ ] Set up Redis queue
- [ ] Implement worker process
- [ ] Run simulations asynchronously
- [ ] Store results in database/S3

### Frontend Enhancements
- [ ] Add state management (Zustand/Redux)
- [ ] Implement proper error handling
- [ ] Add loading states and spinners
- [ ] Create project editor component
- [ ] Add data visualization charts

## Testing

Currently, no tests are implemented. To add tests:

### Frontend Testing
```bash
# Install testing libraries
cd apps/frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Backend Testing
```bash
# Install testing libraries
cd apps/backend
npm install --save-dev jest @types/jest supertest @types/supertest

# Run tests
npm test
```

## Deployment

### Frontend (Vercel/Netlify)

```bash
cd apps/frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/AWS/DigitalOcean)

```bash
cd apps/backend
npm run build
npm start
```

### Environment Variables

Create `.env` file in `apps/backend/`:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/draw2data
REDIS_URL=redis://localhost:6379
```

## Migration from Phase 1

The Phase 1 static site (`apps/web/`) is preserved for reference. To migrate functionality:

1. Extract business logic from `apps/web/app.js`
2. Create React components for each feature
3. Connect components to backend API
4. Test thoroughly before deprecating Phase 1

## Contributing

When contributing to Phase 2:

1. Use TypeScript for all new code
2. Follow existing code structure
3. Add type definitions
4. Write tests for new features
5. Update documentation

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Express Documentation](https://expressjs.com/)
- [Vite Documentation](https://vite.dev/)

---

**Phase 2 Status**: In Progress 🚀
**Last Updated**: 2026-02-13
