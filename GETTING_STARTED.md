# Getting Started with Code Generation System

Welcome! This guide will help you get started with the Code Generation System in minutes.

## 30-Second Quick Start

```bash
# Clone and setup
git clone <repo-url> && cd sns && npm install

# Generate an example app
npm run generate -- --example

# Start the app
cd example-app && docker-compose up

# Open browser to http://localhost:3000
```

That's it! You now have a fully functional web application running.

## What You Just Created

The example application includes:
- ✅ React frontend with login/register
- ✅ Express.js backend with JWT authentication
- ✅ PostgreSQL database with migrations
- ✅ Redis caching
- ✅ Docker containers
- ✅ User management system

Default credentials:
- Email: `admin@example.com`
- Password: Will be set during first run

## Next Steps

### Option 1: Customize the Generated App

Edit the generated code:
```bash
cd example-app/frontend/src  # Edit React components
cd example-app/backend/src   # Modify API endpoints
```

### Option 2: Generate Your Own App

1. **Create a specification file:**

```bash
npm run generate -- --template > my-app.md
```

This creates a template with all sections you need to fill out.

2. **Edit with your requirements:**

Open `my-app.md` and describe what you want:
- What does your app do?
- Who are the users?
- What data does it store?
- How should users log in?

3. **Generate the app:**

```bash
npm run generate -- --spec my-app.md --output ./my-app --name "My App"
```

4. **Start developing:**

```bash
cd my-app
docker-compose up
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## Understanding the Generated Files

### Frontend Files

Located in `frontend/src/`:

- `pages/` - Full page components (LoginPage, Dashboard, etc.)
- `components/` - Reusable UI components (Button, FormInput, etc.)
- `services/` - API communication (authService, apiClient)
- `store/` - Redux state management
- `App.tsx` - Main app component with routing
- Styling with Tailwind CSS

**To add a new page:**
1. Create `pages/MyPage.tsx`
2. Add route in `App.tsx`
3. Add navigation link

### Backend Files

Located in `backend/src/`:

- `controllers/` - Handle requests for each entity
- `routes/` - Define API endpoints
- `middleware/` - Request processing (authentication, validation)
- `config/` - Database and environment config
- `index.ts` - Express server setup

**To add a new endpoint:**
1. Add controller function
2. Add route in `apiRoutes.ts`
3. Test with curl or Postman

### Database Files

Located in `database/`:

- `migrations/` - SQL schema files (numbered sequentially)
- `scripts/` - Setup and seed scripts

**To add a table:**
1. Create new migration file
2. Write SQL
3. Run `npm run migrate`

## API Testing

### Using curl

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "secure123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'

# Use token in requests
curl -X GET http://localhost:5000/api/resource \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new collection
3. Add requests with:
   - Method: GET, POST, PUT, DELETE
   - URL: http://localhost:5000/api/...
   - Headers: `Authorization: Bearer TOKEN`
   - Body: JSON data

## Development Workflow

### Making Changes

**Frontend:**
```bash
cd frontend
npm start  # Auto-reloads on changes
```

**Backend:**
```bash
cd backend
npm run dev  # Restarts on changes
```

**Database:**
```bash
# After schema changes
npm run migrate
```

### Debugging

**Frontend:**
- Open browser DevTools (F12)
- Check Network tab for API calls
- Redux DevTools extension helpful

**Backend:**
- Logs printed to docker console
- Use `docker logs backend` for service logs
- Add `console.log()` in controllers

## Deploying to Production

### Using Docker

```bash
# Build for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Run production version
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Using Kubernetes

```bash
# Create namespace
kubectl apply -f deployment/k8s/namespace.yaml

# Deploy all services
kubectl apply -f deployment/k8s/

# Check status
kubectl get deployment -n app
```

### Using Heroku (or similar)

```bash
# Push to Heroku
# Set environment variables first
heroku config:set DATABASE_URL=...
heroku config:set JWT_SECRET=...

git push heroku main
```

## Common Tasks

### Add User Registration Email Verification

In `backend/src/controllers/authController.ts`:
```typescript
// Add email verification logic
const verified = await sendVerificationEmail(email);
```

### Add Product Listing Page

1. Create `frontend/src/pages/ProductsPage.tsx`
2. Fetch data: `GET /api/products`
3. Display in grid or table
4. Add route in `App.tsx`

### Change Database

Edit `backend/src/config/database.ts` to use MongoDB, MySQL, etc.

### Add Payment Processing

1. Install Stripe: `npm install @stripe/stripe-js`
2. Create payment controller
3. Add payment route
4. Implement frontend checkout

## Troubleshooting

### Port Already in Use

```bash
# Stop existing services
docker-compose down

# Or use different ports
FRONTEND_PORT=3001 BACKEND_PORT=5001 docker-compose up
```

### Database Connection Failed

```bash
# Check database is running
docker-compose ps postgres

# Manually connect and verify
psql postgresql://app:apppassword@localhost:5432/appdb

# Run migrations
npm run migrate
```

### Frontend Shows Blank Page

```bash
# Check browser console for errors
# Verify REACT_APP_API_URL in frontend/.env
# Ensure backend is running: curl http://localhost:5000/health
```

### Can't Login

```bash
# Check credentials in database
docker exec app-postgres psql -U app appdb -c "SELECT * FROM users;"

# Verify JWT_SECRET is set
echo $JWT_SECRET
```

## Learning Resources

- [React Documentation](https://react.dev)
- [Express Guide](https://expressjs.com/guides/routing)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Guide](https://docs.docker.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

1. Check [USAGE.md](./USAGE.md) for detailed documentation
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Look at example specifications in `examples/`
4. Check generated `README.md` in your app
5. Review source code in `src/` directory

## Next: Customization Guide

Once you're comfortable with the basics:

1. **Modify Frontend**: Add custom components, styling, pages
2. **Extend Backend**: Add business logic, validations, integrations
3. **Enhance Database**: Optimize queries, add indexes, create views
4. **Improve Deployment**: Add monitoring, logging, auto-scaling

## Ready to Build?

You're all set! Start with:

```bash
npm run generate -- --example
cd example-app
docker-compose up
```

Then explore the generated code and customize to your needs.

Happy coding! 🚀
