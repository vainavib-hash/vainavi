# Usage Guide

## Table of Contents
1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Creating Specifications](#creating-specifications)
4. [Generated Project Structure](#generated-project-structure)
5. [Customizing Generated Code](#customizing-generated-code)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd sns

# Install dependencies
npm install

# Build the system
npm run build

# Verify installation
npm run generate -- --help
```

## Quick Start

### 1. Generate Example Application

The fastest way to see the system in action:

```bash
npm run generate -- --example
cd example-app
docker-compose up
```

Then visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Database: localhost:5432

### 2. Use Specification Template

Generate a template specification file:

```bash
npm run generate -- --template > my-app-spec.md
```

Edit `my-app-spec.md` with your application requirements, then:

```bash
npm run generate -- --spec my-app-spec.md --output ./my-app --name "My Application"
```

### 3. Generate from Your Specification

Create a specification file describing your application:

```markdown
# My Application

## Overview
Brief description of what your app does.

## Functional Requirements
- User authentication
- Create and manage items
- Generate reports

## Data Models
Model User {
  id: uuid
  email: email
  name: string
}

Model Item {
  id: uuid
  title: string
  description: string
  user_id: uuid
}

## API Endpoints
GET /api/items
POST /api/items
PUT /api/items/:id
DELETE /api/items/:id
```

Then generate:

```bash
npm run generate -- --spec my-app-spec.md --output ./my-app
```

## Creating Specifications

### Specification Format

Specifications can be in Markdown or plain text. The system looks for:

#### 1. Overview Section
Brief description of the application:
```markdown
## Overview
A task management platform for teams to collaborate on projects.
```

#### 2. Requirements Section
List your functional requirements:
```markdown
## Functional Requirements
- User authentication with JWT
- Create, read, update, delete tasks
- Assign tasks to team members
- Track task progress
- Generate productivity reports
```

#### 3. Data Models Section
Define your data structures:
```markdown
## Data Models
Model User {
  id: uuid
  email: email
  password: string
  name: string
}

Model Task {
  id: uuid
  title: string
  description: string
  status: enum[todo, in-progress, done]
  priority: enum[low, medium, high]
  assigned_to: uuid
}
```

#### 4. API Endpoints Section
Specify REST endpoints:
```markdown
## API Endpoints
GET /api/tasks
POST /api/tasks
GET /api/tasks/:id
PUT /api/tasks/:id
DELETE /api/tasks/:id
POST /api/tasks/:id/comments
```

#### 5. Authentication Section
Specify auth method:
```markdown
## Authentication
JWT token-based authentication with secure password hashing
```

#### 6. Database Section
Database requirements:
```markdown
## Database
PostgreSQL for relational data
Redis for caching and sessions
```

#### 7. Deployment Section
Deployment preferences:
```markdown
## Deployment
Docker containers
Docker Compose for development
Kubernetes for production
```

### Field Types

When defining data models, use these field types:
- `string` - Text field
- `number` - Numeric value
- `boolean` - True/false
- `email` - Email address
- `url` - URL/URI
- `date` - Date/timestamp
- `enum[value1, value2]` - Enumeration
- `uuid` - Unique identifier
- `array` - Array of items
- `object` - JSON object

## Generated Project Structure

After generation, your project will have:

```
my-app/
├── frontend/                      # React application
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── FormInput.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/                 # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── [EntityName]Page.tsx
│   │   ├── services/              # API services
│   │   │   ├── apiClient.ts       # Axios setup
│   │   │   └── authService.ts     # Auth API
│   │   ├── store/                 # Redux store
│   │   ├── App.tsx                # Main component
│   │   ├── App.css
│   │   ├── index.tsx              # Entry point
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/                       # Express API
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   │   ├── authController.ts
│   │   │   └── [Entity]Controller.ts
│   │   ├── routes/                # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── apiRoutes.ts
│   │   ├── middleware/            # Custom middleware
│   │   │   ├── auth.ts            # Auth middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── environment.ts
│   │   └── index.ts               # Server entry
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── database/                      # Database schema
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── scripts/
│       ├── migrate.js
│       └── seed.js
│
├── deployment/                    # Docker & K8s
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── nginx.conf
│   ├── .github/
│   │   └── workflows/
│   │       └── ci-cd.yml
│   └── k8s/                       # Kubernetes manifests
│       ├── namespace.yaml
│       ├── backend-deployment.yaml
│       ├── frontend-deployment.yaml
│       └── ingress.yaml
│
├── package.json                   # Root package.json
├── README.md                      # Project documentation
├── DEPLOYMENT.md                  # Deployment guide
└── .gitignore
```

## Customizing Generated Code

### Frontend Customization

#### Adding a New Page

1. Create new file in `frontend/src/pages/MyPage.tsx`:

```typescript
import React from 'react';

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      {/* Your content here */}
    </div>
  );
}
```

2. Add route in `frontend/src/App.tsx`:

```typescript
<Route path="/my-page" element={<MyPage />} />
```

#### Adding a New Component

1. Create in `frontend/src/components/MyComponent.tsx`:

```typescript
import React from 'react';

interface Props {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

#### Styling Components

Use Tailwind CSS classes:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold mb-2">Title</h1>
  <p>Content here</p>
</div>
```

### Backend Customization

#### Adding Business Logic

1. Extend controllers in `backend/src/controllers/`:

```typescript
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await calculateStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};
```

2. Add routes in `backend/src/routes/`:

```typescript
router.get('/stats', authenticate, getStats);
```

#### Adding Middleware

Create in `backend/src/middleware/`:

```typescript
export const customMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Your logic here
  next();
};
```

Add to server in `backend/src/index.ts`:

```typescript
app.use(customMiddleware);
```

### Database Customization

#### Adding a Migration

1. Create new file in `database/migrations/002_add_table.sql`:

```sql
CREATE TABLE IF NOT EXISTS my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. Run migrations:

```bash
npm run migrate
```

## Deployment

### Local Development

```bash
# Start all services with Docker Compose
docker-compose up -d

# Install dependencies (first time only)
docker-compose exec backend npm install
docker-compose exec frontend npm install

# Run migrations
docker-compose exec backend npm run migrate

# View logs
docker-compose logs -f

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

### Production Docker

```bash
# Build images
docker-compose build

# Run with production Docker Compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Set environment variables in .env
DATABASE_URL=postgresql://user:pass@db-host/dbname
JWT_SECRET=your-production-secret
```

### Kubernetes Deployment

```bash
# Create namespace and deploy
kubectl apply -f deployment/k8s/namespace.yaml
kubectl apply -f deployment/k8s/

# Wait for deployment
kubectl rollout status deployment/backend -n app
kubectl rollout status deployment/frontend -n app

# View pods
kubectl get pods -n app

# View logs
kubectl logs -n app deployment/backend
kubectl logs -n app deployment/frontend

# Port forwarding for local testing
kubectl port-forward -n app svc/frontend-service 3000:80
kubectl port-forward -n app svc/backend-service 5000:5000
```

## Troubleshooting

### Ports Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different ports
docker-compose -p myapp up -d
```

### Database Connection Errors

```bash
# Check database is running
docker-compose ps postgres

# Verify DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Run migrations
docker-compose exec backend npm run migrate
```

### Frontend Can't Reach Backend

```bash
# Check API URL in frontend .env
cat frontend/.env

# Should be: REACT_APP_API_URL=http://localhost:5000/api

# Verify backend is running
curl http://localhost:5000/health

# Check CORS in backend config
# Should have: app.use(cors());
```

### Build Errors

```bash
# Clear Docker cache
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose build --no-cache

# Or rebuild specific service
docker-compose build --no-cache backend
```

### TypeScript Errors

```bash
# Rebuild TypeScript
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# Or with Docker
docker-compose exec backend npm run build
docker-compose exec frontend npm run build
```

## Environment Variables

### Backend (.env or .env.local)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/appdb
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key
JWT_EXPIRY=24h
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env or .env.local)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Common Commands

```bash
# Build
npm run build

# Start development
npm run dev

# Start production
npm start

# Run database migrations
npm run migrate

# Seed database
npm run seed

# Docker commands
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose ps             # Status
```

## Performance Tips

1. **Database Indexing**: Indexes are auto-created on common fields
2. **Redis Caching**: Configure for frequently accessed data
3. **Frontend Optimization**: Use React DevTools to identify slow renders
4. **API Optimization**: Add pagination for large datasets
5. **Load Testing**: Use tools like Apache Bench or k6

## Security Considerations

1. Change JWT_SECRET in production
2. Use HTTPS/TLS in production
3. Enable database backups
4. Configure firewall rules
5. Use environment variables for secrets
6. Update dependencies regularly
7. Enable rate limiting

## Support and Resources

- Check generated README.md for project-specific docs
- Review examples in `/examples` directory
- See ARCHITECTURE.md for system design
- Check source code in `/src` directory
