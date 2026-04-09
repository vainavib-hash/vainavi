/**
 * Architecture Designer module
 * Designs the overall architecture based on analyzed requirements
 */

import {
  Architecture,
  AnalysisResult,
  BackendArchitecture,
  DatabaseArchitecture,
  FrontendArchitecture,
  DeploymentArchitecture,
  PageDefinition
} from '../types';

export class ArchitectureDesigner {
  /**
   * Design architecture based on analysis results
   */
  designArchitecture(analysis: AnalysisResult): Architecture {
    return {
      frontend: this.designFrontend(analysis),
      backend: this.designBackend(analysis),
      database: this.designDatabase(analysis),
      deployment: this.designDeployment(analysis)
    };
  }

  private designFrontend(analysis: AnalysisResult): FrontendArchitecture {
    const pages: PageDefinition[] = [];

    // Add auth pages if authentication is required
    if (analysis.authMethods.length > 0) {
      pages.push(
        {
          name: 'Login',
          path: '/login',
          components: ['LoginForm', 'FormInput', 'Button'],
          description: 'User login page'
        },
        {
          name: 'Register',
          path: '/register',
          components: ['RegisterForm', 'FormInput', 'Button'],
          description: 'User registration page'
        }
      );
    }

    // Generate pages for main entities
    for (const entity of analysis.entities) {
      if (!entity.isUser) {
        pages.push({
          name: `${entity.name}List`,
          path: `/${entity.name.toLowerCase()}s`,
          components: [`${entity.name}List`, 'Table', 'Pagination'],
          description: `List all ${entity.name.toLowerCase()}s`
        });

        pages.push({
          name: `${entity.name}Detail`,
          path: `/${entity.name.toLowerCase()}/:id`,
          components: [`${entity.name}Detail`, 'Form', 'Button'],
          description: `View and edit ${entity.name.toLowerCase()}`
        });
      }
    }

    // Dashboard page
    pages.push({
      name: 'Dashboard',
      path: '/dashboard',
      components: ['Dashboard', 'Chart', 'Widget'],
      description: 'Main dashboard'
    });

    return {
      framework: 'react',
      styling: 'tailwind',
      stateManagement: 'redux',
      features: [
        'Responsive Design',
        'Error Handling',
        'Loading States',
        'Form Validation',
        'API Integration'
      ],
      pages
    };
  }

  private designBackend(analysis: AnalysisResult): BackendArchitecture {
    return {
      framework: 'express',
      language: 'typescript',
      apiStyle: 'rest',
      authentication: analysis.authMethods[0] || { type: 'jwt', description: 'JWT authentication' },
      middleware: [
        'cors',
        'helmet',
        'compression',
        'body-parser',
        'morgan',
        'authentication'
      ],
      errorHandling: 'centralized'
    };
  }

  private designDatabase(analysis: AnalysisResult): DatabaseArchitecture {
    // Determine if NoSQL is suitable based on data structure
    const hasArrayFields = analysis.entities.some(e =>
      e.fields.some(f => f.type === 'array' || f.type === 'object')
    );

    return {
      type: hasArrayFields ? 'hybrid' : 'sql',
      primary: 'postgresql',
      secondary: hasArrayFields ? 'mongodb' : undefined,
      caching: 'redis'
    };
  }

  private designDeployment(analysis: AnalysisResult): DeploymentArchitecture {
    const hasKubernetes = analysis.deploymentTargets.some(t => t.type === 'kubernetes');
    const hasServerless = analysis.deploymentTargets.some(t => t.type === 'serverless');

    return {
      platform: hasServerless ? 'aws' : 'docker',
      containerization: true,
      cicd: true,
      monitoring: true,
      loadBalancing: hasKubernetes,
      configuration: {
        imageRegistry: 'docker.io',
        environments: ['development', 'staging', 'production'],
        backupStrategy: 'daily',
        scalingPolicy: 'auto'
      }
    };
  }
}

export default new ArchitectureDesigner();
