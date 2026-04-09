/**
 * Configuration Generator
 * Generates deployment and configuration files
 */

import { GenerationContext, GeneratedFile } from '../../types';

export class ConfigGenerator {
  async generate(context: GenerationContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Docker files
    files.push(...this.generateDockerFiles(context));

    // CI/CD
    files.push(...this.generateCiCdFiles(context));

    // Kubernetes (if applicable)
    if (context.architecture.deployment.loadBalancing) {
      files.push(...this.generateKubernetesFiles(context));
    }

    // Additional configs
    files.push(...this.generateAdditionalConfigs(context));

    return files;
  }

  private generateDockerFiles(context: GenerationContext): GeneratedFile[] {
    return [
      {
        path: 'deployment/Dockerfile.backend',
        content: `FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy application code
COPY backend/dist ./dist

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/index.js"]
`,
        fileType: 'config'
      },
      {
        path: 'deployment/Dockerfile.frontend',
        content: `FROM node:18-alpine as builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
`,
        fileType: 'config'
      },
      {
        path: 'deployment/docker-compose.yml',
        content: `version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: app-postgres
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: apppassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/migrations:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: app-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  backend:
    build:
      context: .
      dockerfile: deployment/Dockerfile.backend
    container_name: app-backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://app:apppassword@postgres:5432/appdb
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-secret-key-change-in-production
      PORT: 5000
    ports:
      - "5000:5000"
    volumes:
      - ./backend/src:/app/src
    command: npm run dev

  frontend:
    build:
      context: .
      dockerfile: deployment/Dockerfile.frontend
    container_name: app-frontend
    depends_on:
      - backend
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    ports:
      - "3000:80"

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    name: app-network
`,
        fileType: 'config'
      },
      {
        path: 'deployment/docker-compose.prod.yml',
        content: `version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: app-postgres-prod
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
    restart: always
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: app-redis-prod
    volumes:
      - redis_data_prod:/data
    restart: always
    networks:
      - app-network

  backend:
    image: \${REGISTRY}/app-backend:latest
    container_name: app-backend-prod
    depends_on:
      - postgres
      - redis
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://app:\${DB_PASSWORD}@postgres:5432/appdb
      REDIS_URL: redis://redis:6379
      JWT_SECRET: \${JWT_SECRET}
      PORT: 5000
    restart: always
    networks:
      - app-network

  frontend:
    image: \${REGISTRY}/app-frontend:latest
    container_name: app-frontend-prod
    depends_on:
      - backend
    restart: always
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: app-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployment/nginx.prod.conf:/etc/nginx/nginx.conf
      - ./deployment/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: always
    networks:
      - app-network

volumes:
  postgres_data_prod:
  redis_data_prod:

networks:
  app-network:
    driver: bridge
`,
        fileType: 'config'
      },
      {
        path: 'deployment/nginx.conf',
        content: `server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        try_files \$uri /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}
`,
        fileType: 'config'
      }
    ];
  }

  private generateCiCdFiles(context: GenerationContext): GeneratedFile[] {
    return [
      {
        path: 'deployment/.github/workflows/ci-cd.yml',
        content: `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: test
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install backend dependencies
        run: |
          cd backend
          npm ci

      - name: Build backend
        run: |
          cd backend
          npm run build

      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci

      - name: Build frontend
        run: |
          cd frontend
          npm run build

  build-docker:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build Docker images
        run: |
          docker-compose build

  deploy:
    needs: build-docker
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to production
        env:
          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}
        run: |
          echo "Deployment script here"
`,
        fileType: 'config'
      }
    ];
  }

  private generateKubernetesFiles(context: GenerationContext): GeneratedFile[] {
    return [
      {
        path: 'deployment/k8s/namespace.yaml',
        content: `apiVersion: v1
kind: Namespace
metadata:
  name: app
  labels:
    name: app
`,
        fileType: 'config'
      },
      {
        path: 'deployment/k8s/backend-deployment.yaml',
        content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: app-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: REDIS_URL
          value: redis://redis-service:6379
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: app
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 5000
    targetPort: 5000
  type: ClusterIP
`,
        fileType: 'config'
      },
      {
        path: 'deployment/k8s/frontend-deployment.yaml',
        content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: app-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: app
spec:
  selector:
    app: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
`,
        fileType: 'config'
      },
      {
        path: 'deployment/k8s/ingress.yaml',
        content: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: app
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - app.example.com
    secretName: app-tls
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 5000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
`,
        fileType: 'config'
      }
    ];
  }

  private generateAdditionalConfigs(context: GenerationContext): GeneratedFile[] {
    return [
      {
        path: '.dockerignore',
        content: `node_modules
npm-debug.log
build
dist
.git
.gitignore
README.md
.env
.DS_Store
coverage
.vscode
.idea
`,
        fileType: 'config'
      },
      {
        path: 'deployment/docker-entrypoint.sh',
        content: `#!/bin/bash
set -e

# Run migrations
echo "Running database migrations..."
npm run migrate

# Start application
echo "Starting application..."
exec "$@"
`,
        fileType: 'script'
      },
      {
        path: 'DEPLOYMENT.md',
        content: `# Deployment Guide

## Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Git

### Quick Start

\`\`\`bash
# Clone repository
git clone <repo-url>
cd project

# Start all services
docker-compose up -d

# Run migrations
npm run migrate

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/api-docs
\`\`\`

## Production Deployment

### Docker Deployment

\`\`\`bash
# Build images
docker-compose build

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
\`\`\`

### Kubernetes Deployment

\`\`\`bash
# Create namespace
kubectl apply -f deployment/k8s/namespace.yaml

# Deploy application
kubectl apply -f deployment/k8s/

# Check status
kubectl get deployments -n app
\`\`\`

## Environment Variables

### Backend
- \`DATABASE_URL\` - PostgreSQL connection string
- \`REDIS_URL\` - Redis connection string
- \`JWT_SECRET\` - JWT signing secret
- \`NODE_ENV\` - Environment (development/production)

### Frontend
- \`REACT_APP_API_URL\` - Backend API URL

## Monitoring

### Docker
\`\`\`bash
docker logs <container-id>
docker stats
\`\`\`

### Kubernetes
\`\`\`bash
kubectl logs <pod-name> -n app
kubectl top pods -n app
\`\`\`

## Backup & Recovery

### Database Backup
\`\`\`bash
docker exec app-postgres pg_dump -U app appdb > backup.sql
\`\`\`

### Database Restore
\`\`\`bash
docker exec -i app-postgres psql -U app appdb < backup.sql
\`\`\`

## Troubleshooting

### Service won't start
- Check logs: \`docker logs <service>\`
- Verify environment variables
- Ensure ports are not in use

### Database connection issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure migrations have run

### Performance issues
- Monitor resource usage
- Check database query performance
- Review application logs
`,
        fileType: 'documentation'
      }
    ];
  }
}
