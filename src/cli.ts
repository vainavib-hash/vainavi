#!/usr/bin/env node

/**
 * Command Line Interface for Code Generation System
 * Usage:
 *   npm run generate -- --spec <path> --output <path> --name <name>
 *   npm run generate -- --template
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'fs-extra';
import * as path from 'path';
import { SystemOrchestrator } from './orchestrator';
import { GenerationConfig, Architecture } from './types';

interface ArgvType {
  spec?: string;
  output?: string;
  name?: string;
  template?: boolean;
  example?: boolean;
  _?: string[];
  $0?: string;
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('spec', {
      alias: 's',
      describe: 'Path to specification file',
      type: 'string'
    })
    .option('output', {
      alias: 'o',
      describe: 'Output directory for generated code',
      type: 'string',
      default: './generated-app'
    })
    .option('name', {
      alias: 'n',
      describe: 'Project name',
      type: 'string',
      default: 'my-application'
    })
    .option('template', {
      alias: 't',
      describe: 'Show specification template',
      type: 'boolean'
    })
    .option('example', {
      alias: 'e',
      describe: 'Generate example application',
      type: 'boolean'
    })
    .help()
    .alias('help', 'h')
    .parse() as unknown as ArgvType;

  const orchestrator = new SystemOrchestrator();

  try {
    // Show template
    if (argv.template) {
      console.log('📋 Specification Template:\n');
      console.log(SystemOrchestrator.generateSpecificationTemplate());
      process.exit(0);
    }

    // Generate example application
    if (argv.example) {
      console.log('📦 Generating example application...\n');
      const exampleSpec = getExampleSpecification();
      const config: GenerationConfig = {
        projectName: 'task-management-app',
        outputDir: argv.output || './example-app',
        includeTests: true,
        includeDocs: true,
        gitIgnore: true,
        envExample: true,
        architecture: {} as Architecture
      };

      const project = await orchestrator.generateApplication(exampleSpec, config);
      console.log('✅ Example application generated successfully!');
      console.log(`📁 Location: ${config.outputDir}`);
      console.log('\n🚀 Next steps:');
      console.log('   cd ' + config.outputDir);
      console.log('   docker-compose up');
      process.exit(0);
    }

    // Generate from specification file
    if (!argv.spec) {
      console.error('❌ Please provide either a specification file or use --example\n');
      console.log('Usage:');
      console.log('  npm run generate -- --spec <path> --output <path> --name <name>');
      console.log('  npm run generate -- --example');
      console.log('  npm run generate -- --template\n');
      process.exit(1);
    }

    // Read specification file
    if (!fs.existsSync(argv.spec)) {
      console.error(`❌ Specification file not found: ${argv.spec}`);
      process.exit(1);
    }

    const specification = fs.readFileSync(argv.spec, 'utf-8');

    // Prepare configuration
    const config: GenerationConfig = {
      projectName: argv.name || 'my-application',
      outputDir: argv.output || './generated-app',
      includeTests: true,
      includeDocs: true,
      gitIgnore: true,
      envExample: true,
      architecture: {} as Architecture
    };

    // Generate application
    const project = await orchestrator.generateApplication(specification, config);

    console.log('✅ Application generated successfully!');
    console.log(`📁 Location: ${config.outputDir}`);
    console.log(`\n📊 Generated Statistics:`);
    console.log(`   Files: ${project.files.length}`);
    console.log(`   Directories: ${Object.keys(project.structure).length}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. cd ${config.outputDir}`);
    console.log('   2. npm install (in both frontend and backend directories)');
    console.log('   3. docker-compose up');
    console.log('   4. Visit http://localhost:3000');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function getExampleSpecification(): string {
  return `# Task Management Application

## Overview
A comprehensive task management application with user authentication, 
real-time notifications, and team collaboration features.

## Functional Requirements
- User registration and authentication with JWT
- Create, read, update, and delete tasks
- Assign tasks to team members
- Track task status and priority
- Add comments and attachments to tasks
- Real-time notifications for task updates
- Search and filter tasks
- Generate reports and analytics

## User Authentication
JWT token-based authentication with secure password hashing.
- User registration endpoint
- User login endpoint
- Token refresh functionality

## Data Models
Model User {
  id: uuid
  email: email
  password: string
  name: string
  created_at: date
}

Model Task {
  id: uuid
  title: string
  description: string
  status: string
  priority: string
  assignee_id: uuid
  created_at: date
  due_date: date
}

Model Team {
  id: uuid
  name: string
  description: string
  created_at: date
}

## API Endpoints
REST API with the following key endpoints:

Authentication:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Tasks:
GET /api/tasks
POST /api/tasks
GET /api/tasks/:id
PUT /api/tasks/:id
DELETE /api/tasks/:id

Teams:
GET /api/teams
POST /api/teams
GET /api/teams/:id
PUT /api/teams/:id

## Database
PostgreSQL for relational data storage with proper indexing.
Redis for caching and session management.

## Deployment
Docker containerization for development and production.
Docker Compose for local development.
Support for Kubernetes deployment in production.

## Security Requirements
- HTTPS/SSL support
- CORS properly configured
- Input validation and sanitization
- Rate limiting on endpoints
- Encrypted password storage
- JWT token expiration

## Performance Requirements
- Response time < 200ms
- Support 1000+ concurrent users
- Database query optimization with indexes
- Redis caching for frequently accessed data
`;
}

// Run CLI
main().catch(console.error);
