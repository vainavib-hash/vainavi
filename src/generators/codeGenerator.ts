/**
 * Base Code Generator Engine
 * Orchestrates the code generation process
 */

import { GenerationContext, GeneratedProject, GeneratedFile, Architecture } from '../types';
import { FrontendGenerator } from './frontend/frontendGenerator';
import { BackendGenerator } from './backend/backendGenerator';
import { DatabaseGenerator } from './database/databaseGenerator';
import { ConfigGenerator } from './config/configGenerator';

export class CodeGenerator {
  private frontendGenerator = new FrontendGenerator();
  private backendGenerator = new BackendGenerator();
  private databaseGenerator = new DatabaseGenerator();
  private configGenerator = new ConfigGenerator();

  /**
   * Generate complete project from context
   */
  async generateProject(context: GenerationContext): Promise<GeneratedProject> {
    const files: GeneratedFile[] = [];

    // Generate project files
    files.push(...await this.generateProjectStructure(context));
    files.push(...await this.frontendGenerator.generate(context));
    files.push(...await this.backendGenerator.generate(context));
    files.push(...await this.databaseGenerator.generate(context));
    files.push(...await this.configGenerator.generate(context));

    return {
      structure: this.buildFileStructure(files),
      files,
      documentation: this.generateDocumentation(context),
      deploymentGuide: this.generateDeploymentGuide(context)
    };
  }

  private async generateProjectStructure(context: GenerationContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    files.push({
      path: 'README.md',
      content: this.generateReadme(context),
      fileType: 'documentation'
    });

    files.push({
      path: '.gitignore',
      content: this.generateGitignore(),
      fileType: 'config'
    });

    files.push({
      path: '.env.example',
      content: this.generateEnvExample(context),
      fileType: 'config'
    });

    files.push({
      path: 'package.json',
      content: this.generatePackageJson(context),
      fileType: 'config'
    });

    return files;
  }

  private generateReadme(context: GenerationContext): string {
    return `# ${context.config.projectName}

## Description
Generated full-stack web application with frontend, backend, and database.

## Project Structure
- \`frontend/\` - React frontend application
- \`backend/\` - Express backend API
- \`database/\` - Database schema and migrations
- \`deployment/\` - Docker and deployment configurations

## Getting Started

### Prerequisites
- Node.js 18+
- Docker
- PostgreSQL (or your configured database)

### Installation

\`\`\`bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
\`\`\`

### Environment Setup

\`\`\`bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
\`\`\`

### Running Locally

\`\`\`bash
# Start backend server
cd backend && npm run dev

# In another terminal, start frontend
cd frontend && npm start
\`\`\`

### Docker Deployment

\`\`\`bash
docker-compose up -d
\`\`\`

## Architecture

### Frontend
- Framework: ${context.architecture.frontend.framework}
- Styling: ${context.architecture.frontend.styling}
- State Management: ${context.architecture.frontend.stateManagement}

### Backend
- Framework: ${context.architecture.backend.framework}
- Language: ${context.architecture.backend.language}
- API Style: ${context.architecture.backend.apiStyle}

### Database
- Primary: ${context.architecture.database.primary}
- Caching: ${context.architecture.database.caching}

## API Documentation

See \`backend/API.md\` for detailed API documentation.

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT
`;
  }

  private generateGitignore(): string {
    return `# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
logs/
*.log
npm-debug.log*

# Database
*.db
*.sqlite
migrations/

# Temporary
tmp/
temp/
`;
  }

  private generateEnvExample(context: GenerationContext): string {
    return `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/${context.config.projectName}
REDIS_URL=redis://localhost:6379

# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h

# API Keys
API_KEY=your-api-key-here
`;
  }

  private generatePackageJson(context: GenerationContext): string {
    const packageJson = {
      name: context.config.projectName,
      version: '1.0.0',
      description: 'Auto-generated full-stack web application',
      scripts: {
        'dev': 'concurrently "cd backend && npm run dev" "cd frontend && npm start"',
        'build': 'npm run build:backend && npm run build:frontend',
        'build:backend': 'cd backend && npm run build',
        'build:frontend': 'cd frontend && npm run build',
        'start': 'cd backend && npm start',
        'docker:up': 'docker-compose up -d',
        'docker:down': 'docker-compose down',
        'migrate': 'cd backend && npm run migrate'
      },
      devDependencies: {
        concurrently: '^8.2.0'
      }
    };

    return JSON.stringify(packageJson, null, 2);
  }

  private generateDocumentation(context: GenerationContext): string {
    return `# Architecture Documentation

## System Overview

This is a full-stack web application generated from specifications.

### Requirements Analyzed
- ${context.analysis.requirements.length} functional requirements
- ${context.analysis.entities.length} entities
- ${context.analysis.apiEndpoints.length} API endpoints

### Technology Stack

**Frontend:** ${context.architecture.frontend.framework}
**Backend:** ${context.architecture.backend.framework} (${context.architecture.backend.language})
**Database:** ${context.architecture.database.primary}
**Authentication:** ${context.architecture.backend.authentication.type}

## Entity Relationships

${this.generateEntityDocs(context)}

## API Endpoints

${this.generateApiDocs(context)}

## Security Measures

- CORS enabled and configured
- Helmet security headers
- Input validation and sanitization
- Password hashing with bcrypt
- JWT authentication tokens
- SQL injection protection
- Rate limiting on endpoints
`;
  }

  private generateDeploymentGuide(context: GenerationContext): string {
    return `# Deployment Guide

## Docker Deployment

### Build Images

\`\`\`bash
docker-compose build
\`\`\`

### Deploy to Production

\`\`\`bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
\`\`\`

## Kubernetes Deployment

### Prerequisites
- kubectl configured
- Kubernetes cluster running

### Deploy

\`\`\`bash
kubectl apply -f deployment/k8s/
kubectl rollout status deployment/app
\`\`\`

## Database Migrations

\`\`\`bash
npm run migrate:prod
\`\`\`

## Monitoring

- Logs: \`docker logs <container-id>\`
- Health checks configured in docker-compose
- Prometheus metrics at \`/metrics\`

## Backup

Database backups automated daily. Configure in \`.env\`:

\`\`\`
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
\`\`\`

## Rollback

\`\`\`bash
docker-compose down
git checkout <previous-tag>
docker-compose up -d
\`\`\`
`;
  }

  private generateEntityDocs(context: GenerationContext): string {
    return context.analysis.entities
      .map(entity => `### ${entity.name}\n${entity.description}`)
      .join('\n\n');
  }

  private generateApiDocs(context: GenerationContext): string {
    return context.analysis.apiEndpoints
      .map(ep => `- \`${ep.method} ${ep.path}\` - ${ep.description}`)
      .join('\n');
  }

  private buildFileStructure(files: GeneratedFile[]): Record<string, any> {
    const structure: Record<string, any> = {};

    for (const file of files) {
      const parts = file.path.split('/');
      let current = structure;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      current[parts[parts.length - 1]] = file.fileType;
    }

    return structure;
  }
}

export default new CodeGenerator();
