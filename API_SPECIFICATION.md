# API Specification for Code Generation System

## Overview

This document specifies the REST API endpoints needed to connect the web interface with the backend code generation system.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently no authentication required for demo/local usage.

For production, recommend JWT tokens:
```
Authorization: Bearer <token>
```

---

## Core Endpoints

### 1. Generate Application

**Endpoint:** `POST /api/generate`

**Description:** Generates a complete application from a specification.

**Request:**
```json
{
  "appName": "My Task Manager",
  "specification": "# Task Manager\n\n## Overview\nA task management system...",
  "options": {
    "framework": "react",
    "backend": "express",
    "database": "postgresql",
    "deployment": "kubernetes"
  },
  "features": {
    "includeTests": true,
    "includeDocs": true,
    "includeCI": true
  }
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "projectId": "proj_123456",
  "appName": "My Task Manager",
  "files": [
    {
      "path": "frontend/src/App.tsx",
      "content": "import React from 'react'...",
      "size": 1024
    }
  ],
  "structure": {
    "frontend": { "components": 12, "pages": 5 },
    "backend": { "controllers": 4, "routes": 10 },
    "database": { "tables": 8, "migrations": 3 }
  },
  "stats": {
    "totalFiles": 47,
    "totalLines": 2547,
    "generationTime": 2.34
  },
  "downloadUrl": "/api/download/proj_123456"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "Invalid specification format",
  "details": "Missing required section: 'Data Models'"
}
```

---

### 2. Download Generated Project

**Endpoint:** `GET /api/download/:projectId`

**Description:** Downloads generated project as ZIP file.

**Query Parameters:**
- `format` (optional): `zip` (default), `tar`, `json`

**Response:**
- Content-Type: `application/zip`
- File: `project_name.zip`

**Example:**
```
GET /api/download/proj_123456
GET /api/download/proj_123456?format=tar
```

---

### 3. Get Examples

**Endpoint:** `GET /api/examples`

**Description:** Retrieves all available example specifications.

**Response (200):**
```json
{
  "examples": [
    {
      "id": "task-manager",
      "name": "Task Management System",
      "description": "Complete task management with teams...",
      "specification": "# Task Manager\n...",
      "tags": ["tasks", "teams", "collaboration"],
      "complexity": "medium"
    },
    {
      "id": "ecommerce",
      "name": "E-Commerce Platform",
      "description": "Full-featured online store...",
      "specification": "# E-Commerce\n...",
      "tags": ["store", "products", "orders"],
      "complexity": "high"
    },
    {
      "id": "analytics",
      "name": "Analytics Dashboard",
      "description": "Real-time metrics and visualization...",
      "specification": "# Analytics\n...",
      "tags": ["analytics", "metrics", "reports"],
      "complexity": "medium"
    }
  ]
}
```

---

### 4. Get Single Example

**Endpoint:** `GET /api/examples/:exampleId`

**Description:** Retrieves a specific example specification.

**Parameters:**
- `exampleId`: Example identifier (e.g., `task-manager`)

**Response (200):**
```json
{
  "id": "task-manager",
  "name": "Task Management System",
  "description": "Complete task management...",
  "specification": "# Task Manager\n...",
  "generatedExample": {
    "fileCount": 47,
    "codeLinesGenerated": 2547,
    "technologies": {
      "frontend": "React 18 + TypeScript",
      "backend": "Express.js + TypeScript",
      "database": "PostgreSQL"
    }
  }
}
```

---

### 5. Validate Specification

**Endpoint:** `POST /api/validate`

**Description:** Validates a specification without generating code.

**Request:**
```json
{
  "specification": "# My App\n...",
  "strict": false
}
```

**Response (200):**
```json
{
  "valid": true,
  "warnings": [],
  "analysis": {
    "requirements": 8,
    "entities": 5,
    "relationships": 12,
    "endpoints": 20
  }
}
```

**Response (400):**
```json
{
  "valid": false,
  "errors": [
    "Missing 'Overview' section",
    "Data model 'User' not defined"
  ]
}
```

---

### 6. Get Generation Status

**Endpoint:** `GET /api/status/:projectId`

**Description:** Gets the status of a generation in progress.

**Response (200):**
```json
{
  "projectId": "proj_123456",
  "status": "generating",
  "progress": 65,
  "currentStep": "Generating backend controllers...",
  "estimatedTimeRemaining": 5,
  "startTime": "2024-01-15T10:30:00Z",
  "completedAt": null
}
```

---

### 7. List Generated Projects

**Endpoint:** `GET /api/projects`

**Description:** Lists all generated projects (requires auth in production).

**Query Parameters:**
- `limit` (default: 20)
- `offset` (default: 0)
- `sort` (default: `date`)

**Response (200):**
```json
{
  "projects": [
    {
      "projectId": "proj_123456",
      "appName": "Task Manager",
      "createdAt": "2024-01-15T10:30:00Z",
      "framework": "react",
      "backend": "express",
      "database": "postgresql",
      "files": 47,
      "downloadUrl": "/api/download/proj_123456"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

---

### 8. Delete Generated Project

**Endpoint:** `DELETE /api/projects/:projectId`

**Description:** Deletes a generated project.

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### 9. Get Tech Stack Options

**Endpoint:** `GET /api/options`

**Description:** Gets available options for tech stack selection.

**Response (200):**
```json
{
  "frameworks": [
    {
      "id": "react",
      "name": "React 18",
      "description": "Modern UI library",
      "icon": "⚛️"
    },
    {
      "id": "vue",
      "name": "Vue 3",
      "description": "Progressive framework",
      "icon": "💚"
    }
  ],
  "backends": [
    {
      "id": "express",
      "name": "Express.js",
      "description": "Node.js web framework",
      "icon": "🚂"
    }
  ],
  "databases": [
    {
      "id": "postgresql",
      "name": "PostgreSQL",
      "description": "Advanced relational DB",
      "icon": "🐘"
    }
  ],
  "deployments": [
    {
      "id": "docker-compose",
      "name": "Docker Compose",
      "description": "Local containerization"
    }
  ]
}
```

---

### 10. Get Specification Template

**Endpoint:** `GET /api/template`

**Description:** Gets the specification template.

**Response (200):**
```json
{
  "template": "# My Application\n\n## Overview\n...",
  "sections": [
    {
      "name": "Overview",
      "required": true,
      "description": "Brief description of the application"
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error code",
  "message": "Human readable message",
  "details": {}
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |
| 503 | Service Unavailable |

---

## Rate Limiting

All endpoints are rate-limited (future implementation):

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## WebSocket Events (Optional)

For real-time generation updates:

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:5000/ws');
```

**Events:**
```javascript
// Generation started
ws.onmessage = (event) => {
  const { type, projectId, progress, message } = JSON.parse(event.data);
  
  if (type === 'progress') {
    console.log(`${progress}% - ${message}`);
  } else if (type === 'complete') {
    console.log('Generation complete!');
  }
};
```

---

## Implementation Examples

### Using Fetch

```javascript
// Generate application
const response = await fetch('http://localhost:5000/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    appName: 'My App',
    specification: '...',
    options: {
      framework: 'react',
      backend: 'express',
      database: 'postgresql',
      deployment: 'kubernetes'
    }
  })
});

const result = await response.json();
console.log(result.projectId);

// Download project
const downloadUrl = `/api/download/${result.projectId}`;
window.open(downloadUrl);
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Generate
const { data } = await api.post('/generate', {
  appName: 'My App',
  specification: '...',
  options: { /* ... */ }
});

// Download
window.location.href = `/api/download/${data.projectId}`;

// Get examples
const examples = await api.get('/examples');
```

---

## Database Schema (for API)

### Projects Table
```sql
CREATE TABLE generated_projects (
  id UUID PRIMARY KEY,
  app_name VARCHAR(255) NOT NULL,
  specification TEXT NOT NULL,
  framework VARCHAR(50),
  backend VARCHAR(50),
  database VARCHAR(50),
  deployment VARCHAR(50),
  file_count INTEGER,
  total_lines INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  status VARCHAR(50) DEFAULT 'completed'
);
```

---

## Deployment

### Local Development

```bash
# Start API server
node api-server.js

# Or with hot reload
nodemon api-server.js
```

### Production

```bash
# Docker
docker build -t codegen-api .
docker run -p 5000:5000 codegen-api

# Or Kubernetes
kubectl apply -f api-deployment.yaml
```

---

## Future Enhancements

- [ ] User accounts and authentication
- [ ] Project history and versioning
- [ ] Custom code templates
- [ ] Plugin system for extensions
- [ ] Real-time collaboration
- [ ] Advanced analytics/metrics
- [ ] Mobile app generation
- [ ] GraphQL API option

---

## Related Files

- `web/script.js` - Frontend calling these endpoints
- `src/orchestrator.ts` - Backend generation logic
- `src/cli.ts` - Command-line interface
- See inline documentation in code for more details

---

**Note:** This specification describes the API to build. The backend generation system (`src/`) already exists. You need to wrap it with these HTTP endpoints using Express.js.
