# Installation & Setup Guide

## Prerequisites

- Node.js 16+ (for running TypeScript system)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git (optional, for version control)

## 📥 Installation

### Option 1: Web Interface Only (No Installation)

The web interface works directly in your browser:

```bash
# Windows
start web/index.html

# macOS
open web/index.html

# Linux
xdg-open web/index.html
```

Or drag `web/index.html` into your browser.

### Option 2: With Local Server (Recommended)

**Using Python 3:**
```bash
cd web
python -m http.server 8000
# Open http://localhost:8000
```

**Using Python 2:**
```bash
cd web
python -m SimpleHTTPServer 8000
# Open http://localhost:8000
```

**Using Node.js:**
```bash
cd web
npx http-server
# Open http://localhost:8080
```

**Using Node.js (with live reload):**
```bash
npm install -g http-server
cd web
http-server
```

### Option 3: Full System Setup (CLI + API)

**Install Dependencies:**
```bash
npm install
```

**Verify Installation:**
```bash
npm run build
npm run cli -- --template
```

---

## 🏃 Quick Start

### 5-Minute Setup

1. **Option A - Web Interface:**
   ```bash
   # Just open in browser
   open web/index.html
   ```

2. **Option B - With Local Server:**
   ```bash
   python -m http.server 8000
   open http://localhost:8000
   ```

3. Enter project name or load example

4. Click "Generate Application"

5. Download generated project

### 10-Minute Full Setup

1. **Install Node dependencies:**
   ```bash
   npm install
   ```

2. **Build TypeScript:**
   ```bash
   npm run build
   ```

3. **Start web server:**
   ```bash
   python -m http.server 8000
   ```

4. **Open interface:**
   ```
   http://localhost:8000/web
   ```

5. **Generate your first app:**
   - Load example or write spec
   - Click Generate
   - Download

---

## 📁 Project Structure

```
sns/
├── src/                          # TypeScript system (backend)
│   ├── types.ts                  # Type definitions (260 lines)
│   ├── index.ts                  # Main exports
│   ├── orchestrator.ts           # System orchestration
│   ├── analyzers/
│   │   └── requirementAnalyzer.ts# Parse specifications (400 lines)
│   ├── designers/
│   │   └── architectureDesigner.ts
│   ├── generators/
│   │   ├── codeGenerator.ts      # Main generator (350 lines)
│   │   ├── frontend/
│   │   │   └── frontendGenerator.ts (1200 lines React code)
│   │   ├── backend/
│   │   │   └── backendGenerator.ts (500 lines Express code)
│   │   ├── database/
│   │   │   └── databaseGenerator.ts
│   │   └── config/
│   │       └── configGenerator.ts
│   └── cli.ts                    # Command-line interface
│
├── web/                          # Web interface
│   ├── index.html                # Main interface (350 lines)
│   ├── dashboard.html            # Quick dashboard
│   ├── styles.css                # Styling (850 lines)
│   ├── script.js                 # JavaScript (600+ lines)
│   └── README.md                 # Web interface docs
│
├── examples/                      # Example specifications
│   ├── task-management-spec.md
│   └── ecommerce-spec.md
│
├── docs/                         # Documentation
│   ├── README.md                 # Main documentation
│   ├── ARCHITECTURE.md           # System design
│   ├── USAGE.md                  # Usage guide
│   ├── GETTING_STARTED.md        # Getting started
│   ├── DEPLOYMENT.md             # Production deployment
│   ├── QUICK_START.md            # Quick reference
│   └── API_SPECIFICATION.md      # API endpoints
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── .env.example                  # Environment template
└── .gitignore                    # Git ignore rules
```

---

## 🛠️ Common Tasks

### Run Web Interface

**In Browser (Easiest):**
```bash
open web/index.html
```

**With Local Server:**
```bash
python -m http.server 8000
# Then http://localhost:8000/web/
```

### Generate from CLI

**Show Template:**
```bash
npm run cli -- --template
```

**Generate Example:**
```bash
npm run cli -- --example
```

**From Custom Spec:**
```bash
npm run cli -- --spec examples/task-management-spec.md --output ./my-app --name "Task Manager"
```

### Build & Test

```bash
# Build TypeScript
npm run build

# Run tests (when added)
npm test

# Clean build
rm -rf dist && npm run build
```

### View Generated Code

After generation, folder contains:

```
generated-app/
├── frontend/          # React application
├── backend/           # Express API
├── database/          # SQL schemas
└── deployment/        # Docker & K8s configs
```

---

## 🌐 Environment Setup

### For Web Interface

No setup needed! Just open `web/index.html` in browser.

### For TypeScript System

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
OUTPUT_DIR=./generated
API_PORT=5000
```

## 💾 Configuration

### TypeScript Config (`tsconfig.json`)
- Target: ES2020
- Module: CommonJS
- Strict: true
- Lib: ES2020

### Package.json Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "cli": "ts-node src/cli.ts",
    "dev": "ts-node src/index.ts",
    "test": "jest",
    "clean": "rm -rf dist"
  }
}
```

### Environment Variables

See `.env.example` for available variables.

---

## 🚀 First Generation

### Method 1: Web Interface (Easiest)

1. Open `web/index.html`
2. Enter "My First App"
3. Click "Generate Application"
4. See results in modal
5. Click "Download Project"

### Method 2: CLI

```bash
# Generate example
npm run cli -- --example

# Check output
ls generated/example-app/
```

### Method 3: Programmatic

```typescript
import { SystemOrchestrator } from './src';

const orchestrator = new SystemOrchestrator();
const project = await orchestrator.generateApplication({
  name: 'My App',
  specification: '# My App\n...'
});
```

---

## ✅ Verification

### Verify Installation

```bash
# Check Node
node --version  # Should be 16+

# Check npm
npm --version

# Check files exist
ls src/
ls web/
```

### Verify TypeScript Setup

```bash
# Build
npm run build

# Should create dist/
ls dist/
```

### Verify Web Interface

```bash
# Check files
ls web/index.html
ls web/script.js
ls web/styles.css

# In browser, should show:
# - Navigation bar
# - Hero section
# - Features
# - Generator form
# - Examples
# - Tech stack
# - Docs
# - Footer
```

---

## 🐛 Troubleshooting

### Web Interface Not Loading

**Problem:** Blank page or 404 error

**Solutions:**
1. Check file path is correct
2. Use local server: `python -m http.server 8000`
3. Check browser console (F12)
4. Ensure script.js is in same folder

### Cannot Run CLI

**Problem:** `npm run cli` doesn't work

**Solutions:**
```bash
# Verify Node/npm installed
node --version
npm --version

# Install dependencies
npm install

# Build first
npm run build

# Try again
npm run cli -- --template
```

### Browser Console Errors

**Check errors in browser (F12 → Console)**

Common issues:
- Script not found → ensure same directory
- FormData issues → use modern browser
- CORS errors → use local server, not file://

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📚 Documentation Locations

| Document | Location | Purpose |
|----------|----------|---------|
| This file | `INSTALL.md` | Setup instructions |
| Quick start | `QUICK_START.md` | 5-minute guide |
| Main docs | `README.md` | Overview & features |
| Architecture | `ARCHITECTURE.md` | Technical design |
| Usage guide | `USAGE.md` | Detailed examples |
| Getting started | `GETTING_STARTED.md` | Beginner guide |
| Deployment | `DEPLOYMENT.md` | Production setup |
| API spec | `API_SPECIFICATION.md` | API endpoints |
| Web UI | `web/README.md` | Web interface guide |

---

## 🎯 Next Steps

1. **Choose your path:**
   - Web interface: `open web/index.html`
   - CLI: `npm run cli -- --template`
   - Programmatic: Create TypeScript file

2. **Generate your first app:**
   - Load example or write spec
   - Select technologies
   - Generate

3. **Explore generated code:**
   - Frontend React components
   - Backend Express routes
   - Database schemas
   - Docker configs

4. **Customize and deploy:**
   - Modify generated code
   - Add business logic
   - Deploy to cloud

---

## 🆘 Getting Help

1. **Check documentation:**
   - `QUICK_START.md` - Quick reference
   - `USAGE.md` - Detailed guide
   - `ARCHITECTURE.md` - System design

2. **Review examples:**
   - `examples/task-management-spec.md`
   - `examples/ecommerce-spec.md`

3. **Check generated code:**
   - Look at generated app structure
   - Review generated files
   - Study patterns

4. **Browser console:**
   - F12 → Console
   - Look for error messages
   - Check network tab

---

## ✨ You're Ready!

Everything is installed. Now:

```bash
# Option 1: Web Interface
open web/index.html

# Option 2: Local Server
python -m http.server 8000

# Option 3: CLI
npm run cli -- --example
```

**Happy generating! 🚀**

---

## System Requirements

| Component | Requirement | Status |
|-----------|-------------|--------|
| Node.js | 16+ | Optional (CLI only) |
| npm | 8+ | Optional (CLI only) |
| Browser | Modern (2020+) | Required for web UI |
| Python | 3.6+ | Optional (local server) |
| Disk Space | 500 MB | For node_modules |
| RAM | 4 GB minimum | Recommended |
| OS | Any | Windows, Mac, Linux |

---

**Version:** 1.0.0
**Last Updated:** 2024
**License:** MIT
