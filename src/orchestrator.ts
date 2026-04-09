/**
 * Main System Orchestrator
 * Coordinates all components of the code generation system
 */

import { GenerationContext, GeneratedProject, AnalysisResult, Architecture, GenerationConfig } from './types';
import { RequirementAnalyzer } from './analyzers/requirementAnalyzer';
import { ArchitectureDesigner } from './designers/architectureDesigner';
import { CodeGenerator } from './generators/codeGenerator';
import * as fs from 'fs-extra';
import * as path from 'path';

export class SystemOrchestrator {
  private analyzer = new RequirementAnalyzer();
  private designer = new ArchitectureDesigner();
  private generator = new CodeGenerator();

  /**
   * Main orchestration method - converts specification to complete project
   */
  async generateApplication(
    specification: string,
    config: GenerationConfig
  ): Promise<GeneratedProject> {
    console.log('🚀 Starting code generation system...\n');

    try {
      // Step 1: Analyze requirements
      console.log('📖 Step 1: Analyzing specification...');
      const analysis = await this.analyzer.analyzeSpecification(specification);
      console.log(`   ✓ Found ${analysis.requirements.length} requirements`);
      console.log(`   ✓ Identified ${analysis.entities.length} entities`);
      console.log(`   ✓ Generated ${analysis.apiEndpoints.length} API endpoints\n`);

      // Step 2: Design architecture
      console.log('🏗️  Step 2: Designing architecture...');
      const architecture = this.designer.designArchitecture(analysis);
      console.log(`   ✓ Frontend: ${architecture.frontend.framework} + ${architecture.frontend.styling}`);
      console.log(`   ✓ Backend: ${architecture.backend.framework} (${architecture.backend.language})`);
      console.log(`   ✓ Database: ${architecture.database.type} (${architecture.database.primary})`);
      console.log(`   ✓ Auth: ${architecture.backend.authentication.type}\n`);

      // Step 3: Generate code
      console.log('🔧 Step 3: Generating code...');
      const context: GenerationContext = {
        analysis,
        architecture,
        config
      };

      const project = await this.generator.generateProject(context);
      console.log(`   ✓ Generated ${project.files.length} files`);
      console.log(`   ✓ ${Object.keys(project.structure).length} directories\n`);

      // Step 4: Write files to disk
      console.log('💾 Step 4: Writing files to disk...');
      await this.writeProjectFiles(project, config.outputDir);
      console.log(`   ✓ Files written to ${config.outputDir}\n`);

      return project;
    } catch (error) {
      console.error('❌ Generation failed:', error);
      throw error;
    }
  }

  /**
   * Write generated files to disk
   */
  private async writeProjectFiles(project: GeneratedProject, outputDir: string): Promise<void> {
    // Create root directory
    await fs.ensureDir(outputDir);

    // Write each file
    for (const file of project.files) {
      const filePath = path.join(outputDir, file.path);
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, file.content, 'utf-8');
    }

    // Log file count
    console.log(`   ℹ️  ${project.files.length} files written successfully`);
  }

  /**
   * Generate a specification template for users
   */
  static generateSpecificationTemplate(): string {
    return `# Application Specification

## Overview
Describe your application at a high level.

## Functional Requirements
- Requirement 1
- Requirement 2
- Requirement 3

## User Authentication
Specify authentication method:
- JWT tokens
- OAuth2
- Session-based

## Data Models
Describe your application entities:

Model User {
  id: uuid
  email: email
  name: string
  created_at: date
}

Model Product {
  id: uuid
  name: string
  description: string
  price: number
}

## API Endpoints
Specify key API endpoints:

GET /api/products
POST /api/products
GET /api/products/:id
PUT /api/products/:id
DELETE /api/products/:id

## Database
- Specify database type (PostgreSQL, MongoDB, etc.)
- Any specific requirements

## Deployment
- Docker containers
- Kubernetes
- Serverless

## Security Requirements
- HTTPS/SSL
- CORS configuration
- Input validation
- Rate limiting

## Performance Requirements
- Caching strategy
- Scalability needs
- Load balancing
`;
  }
}

export default new SystemOrchestrator();
