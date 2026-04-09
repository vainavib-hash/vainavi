# Quick Start Guide

## 🚀 Getting Started with Code Generation System

### What's This?

The Code Generation System is a comprehensive tool that converts natural language specifications into fully functional web applications, complete with:
- Frontend (React)
- Backend (Express.js)
- Database (PostgreSQL)
- Deployment (Docker, Kubernetes)
- CI/CD Pipeline

## 📦 What You Have

### Files Created

**Backend System (TypeScript):**
- `src/` - Complete Node.js TypeScript system
  - `types.ts` - Type definitions
  - `analyzers/` - Requirement analysis
  - `designers/` - Architecture design
  - `generators/` - Code generation
  - `orchestrator.ts` - Main orchestration
  - `cli.ts` - Command-line interface

**Web Interface (HTML/CSS/JavaScript):**
- `web/index.html` - Full-featured web interface (350+ lines)
- `web/styles.css` - Professional styling (850+ lines)
- `web/script.js` - Interactive JavaScript
- `web/dashboard.html` - Quick-access dashboard
- `web/README.md` - Web interface documentation

**Documentation:**
- `README.md` - Main documentation
- `ARCHITECTURE.md` - System architecture
- `USAGE.md` - Detailed usage guide
- `GETTING_STARTED.md` - Getting started
- `DEPLOYMENT.md` - Production deployment

**Examples & Config:**
- `examples/task-management-spec.md`
- `examples/ecommerce-spec.md`
- `package.json` - Dependencies
- `.env.example` - Environment template

---

## 🎯 Two Ways to Use

### Method 1: Web Interface (Easiest)

**Option A - Full Interface:**

```bash
# Navigate to the web folder
cd web

# Start a local server
python -m http.server 8000
# or
npx http-server

# Open browser
open http://localhost:8000/index.html
```

Then:
1. Enter project name
2. Write specification (or load example)
3. Select technologies
4. Click "Generate Application"
5. Download project

**Option B - Quick Dashboard:**

```bash
open web/dashboard.html
```

Simpler interface with quick-start buttons.

### Method 2: Command Line (Developers)

**Install Dependencies:**

```bash
npm install
```

**Compile TypeScript:**

```bash
npm run build
```

**Generate Application:**

```bash
# From template
npm run cli -- --template

# From example
npm run cli -- --example

# From custom spec file
npm run cli -- --spec examples/task-management-spec.md --output ./generated --name "My App"
```

---

## 📝 Writing Specifications

### Simple Example

```markdown
# Task Manager

## Overview
A simple task management app for teams.

## Requirements
- User authentication
- Create tasks
- Assign to team members
- Track status

## Data Models
Model Task {
  id: uuid
  title: string
  status: enum[todo, in-progress, done]
  assigned_to: uuid
}

## API
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

## Database
PostgreSQL
```

### Full Example

See `examples/task-management-spec.md` for a complete specification.

---

## 🛠️ System Design

```
Input Specification
        ↓
    └─→ Requirement Analyzer
            ↓
        └─→ Architecture Designer
                ↓
            └─→ Frontend Generator (React)
            ├─→ Backend Generator (Express)
            ├─→ Database Generator (PostgreSQL)
            └─→ Config Generator (Docker, K8s)
                    ↓
            Generated Application
```

---

## 📚 Generated Application Includes

### Frontend
- React 18 with TypeScript
- Redux for state management
- Tailwind CSS for styling
- React Router for navigation
- Protected routes
- Authentication integration

### Backend
- Express.js with TypeScript
- JWT authentication
- RESTful API endpoints
- Database integration
- Error handling
- Input validation

### Database
- PostgreSQL schemas
- Migration scripts
- Seed data
- Index optimization
- Foreign key relationships

### Infrastructure
- Docker containers
- Docker Compose setup
- Kubernetes manifests
- GitHub Actions CI/CD
- Nginx configuration
- Production deployment

---

## 💡 Usage Examples

### Example 1: E-Commerce Store

```bash
# In web interface, click "Examples" → "E-Commerce Platform"
# Or run CLI
npm run cli -- --example
```

Generates: Complete online store with:
- Product catalog
- Shopping cart
- Orders & payments
- Admin dashboard

### Example 2: Custom App

1. Write specification in web interface
2. Describe requirements
3. Select React + Express + PostgreSQL + Kubernetes
4. Click Generate
5. Download and run

```bash
# Run generated app
cd generated-app
docker-compose up
# Open http://localhost:3000
```

---

## 🚀 Running Generated Applications

Each generated application includes:

**Development:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

**With Docker:**
```bash
docker-compose up
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up
# Or deploy to Kubernetes
kubectl apply -f deployment/k8s/
```

---

## 📊 What Gets Generated

### Project Structure
```
my-app/
├── frontend/              # React app (1200+ LoC)
├── backend/               # Express API (500+ LoC)
├── database/              # Migrations, seeds
├── deployment/            # Docker, K8s configs
├── package.json           # Dependencies
├── docker-compose.yml     # Local setup
└── README.md             # Project docs
```

### Code Lines Generated
- **Frontend:** 1200+ lines of production React code
- **Backend:** 500+ lines of Express.js API code
- **Database:** 250+ lines of SQL schemas/migrations
- **Config:** 600+ lines of deployment configs
- **Total:** 2500+ lines per generated application

---

## 🔧 Customization

### After Generation

The generated code is yours to customize:

**Frontend:**
- Add more pages/components
- Modify styling
- Extend Redux store
- Add new routes

**Backend:**
- Add business logic
- Implement more endpoints
- Add middleware
- Connect external services

**Database:**
- Add new tables/relations
- Create indexes
- Write complex queries
- Add stored procedures

---

## 📖 Documentation

**Main:**
- `README.md` - Overview and features
- `ARCHITECTURE.md` - System design details
- `USAGE.md` - Detailed usage guide with customization

**Web:**
- `web/README.md` - Web interface guide
- `web/index.html` - Has built-in doc links section

**Generated Doc:**
- Each generated app includes `README.md` with setup instructions

---

## 🎨 Customizing Web Interface

### Change Colors

Edit `web/styles.css`:
```css
:root {
    --primary: #3b82f6;        /* Change to #a855f7 for purple */
    --secondary: #10b981;      /* Or #f59e0b for amber */
}
```

### Add New Section

Edit `web/index.html`:
```html
<section id="my-section">
    <div class="container">
        <h2 class="section-title">My Feature</h2>
        <!-- Content -->
    </div>
</section>
```

### Load Different Examples

Edit `web/script.js` - the `examples` object with your own specs.

---

## 🐛 Troubleshooting

### Web Interface
**Page doesn't load?**
- Make sure you're running a local server (not file://)
- Python: `python -m http.server 8000`
- Node: `npx http-server`

**Buttons don't work?**
- Check browser console (F12 → Console)
- Make sure script.js is loaded

### CLI
**Dependencies missing?**
```bash
npm install
```

**Can't run TypeScript?**
```bash
npm install -g ts-node typescript
```

**Generation errors?**
- Check specification format (see examples)
- Ensure fields are defined in models
- Verify model names match relationships

### Generated App
**React app won't start?**
```bash
# Clear cache and reinstall
rm -rf frontend/node_modules
cd frontend && npm install
npm start
```

**Backend errors?**
```bash
# Check database connection
# Verify .env file has correct DB credentials
```

---

## 🎓 Learning Path

1. **Beginners:** Start with web dashboard → load example → download
2. **Intermediate:** Write custom spec → generate → explore code
3. **Advanced:** Modify sources → rebuild → deploy to cloud
4. **Expert:** Create custom templates → build generators → share

---

## 🌟 Features Showcase

### Analyzer
✅ Natural language processing
✅ Entity extraction
✅ Relationship detection
✅ API endpoint identification
✅ Auth method recognition

### Designer
✅ Tech stack selection
✅ Architecture design
✅ Scalability consideration
✅ Security best practices
✅ Deployment strategy

### Generators
✅ React components & pages
✅ Express routes & controllers
✅ PostgreSQL schemas
✅ Docker & K8s configs
✅ CI/CD pipelines

---

## 🤝 Integration

### Connect Your Backend
Edit `web/script.js`:
```javascript
const API_URL = 'http://your-api.com/api';

fetch(`${API_URL}/generate`, {
    method: 'POST',
    body: JSON.stringify(formData)
})
```

### Deploy Generated App
1. Generate in web interface
2. Download ZIP file
3. Push to GitHub
4. Deploy to Heroku, AWS, DigitalOcean, etc.

---

## 📞 Next Steps

1. **Open web interface:** `web/index.html`
2. **Write a spec** or **load example**
3. **Generate** your first application
4. **Download** and explore the code
5. **Customize** as needed
6. **Deploy** to production

---

## 💾 File Organization

```
sns/                           # Root directory
├── src/                        # TypeScript backend system
│   ├── analyzers/
│   ├── designers/
│   ├── generators/
│   └── index.ts
├── web/                        # Web interface
│   ├── index.html             # Full interface
│   ├── dashboard.html         # Quick dashboard
│   ├── styles.css
│   ├── script.js
│   └── README.md
├── examples/                   # Specification examples
├── docs/                       # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎉 You're Ready!

Everything is set up and ready to use. Choose your preferred interface and start generating applications!

**Questions?** Check the comprehensive documentation in the repo.

**Ready?** Open `web/index.html` or `web/dashboard.html` now! 🚀

---

**Happy coding! 💻**
