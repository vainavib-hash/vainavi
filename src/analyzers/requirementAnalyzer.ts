/**
 * Natural Language Processing module for requirement analysis
 * Converts natural language specifications into structured requirements
 */

import {
  Requirement,
  RequirementType,
  AnalysisResult,
  Entity,
  EntityField,
  ApiEndpoint,
  AuthMethod,
  DeploymentTarget,
  FieldType,
  Relationship
} from './types';

export class RequirementAnalyzer {
  /**
   * Analyze natural language specification and extract requirements
   */
  async analyzeSpecification(specification: string): Promise<AnalysisResult> {
    return {
      requirements: this.extractRequirements(specification),
      entities: this.extractEntities(specification),
      relationships: this.extractRelationships(specification),
      apiEndpoints: this.extractApiEndpoints(specification),
      authMethods: this.extractAuthMethods(specification),
      deploymentTargets: this.extractDeploymentTargets(specification)
    };
  }

  private extractRequirements(specification: string): Requirement[] {
    const requirements: Requirement[] = [];
    const lines = specification.split('\n').filter(l => l.trim());

    let reqId = 0;
    for (const line of lines) {
      const type = this.classifyRequirement(line);
      if (type) {
        requirements.push({
          id: `REQ-${++reqId}`,
          description: line.trim(),
          type,
          priority: this.extractPriority(line)
        });
      }
    }

    return requirements;
  }

  private classifyRequirement(text: string): RequirementType | null {
    const lower = text.toLowerCase();

    if (this.matchesKeywords(lower, ['user', 'admin', 'login', 'signup', 'register', 'password', 'token', 'jwt', 'oauth'])) {
      return RequirementType.AUTHENTICATION;
    }
    if (this.matchesKeywords(lower, ['database', 'store', 'persist', 'sql', 'nosql', 'schema'])) {
      return RequirementType.DATABASE;
    }
    if (this.matchesKeywords(lower, ['api', 'endpoint', 'rest', 'graphql', 'request', 'response'])) {
      return RequirementType.API;
    }
    if (this.matchesKeywords(lower, ['deploy', 'docker', 'kubernetes', 'aws', 'heroku', 'production', 'environment'])) {
      return RequirementType.DEPLOYMENT;
    }
    if (this.matchesKeywords(lower, ['security', 'encryption', 'https', 'cors', 'validation', 'sanitize'])) {
      return RequirementType.SECURITY;
    }
    if (this.matchesKeywords(lower, ['performance', 'cache', 'scalable', 'optimization', 'load'])) {
      return RequirementType.NON_FUNCTIONAL;
    }

    return RequirementType.FUNCTIONAL;
  }

  private extractPriority(text: string): 'low' | 'medium' | 'high' {
    const lower = text.toLowerCase();
    if (this.matchesKeywords(lower, ['critical', 'must', 'essential', 'high priority', 'important'])) {
      return 'high';
    }
    if (this.matchesKeywords(lower, ['should', 'nice to have', 'optional', 'low priority'])) {
      return 'low';
    }
    return 'medium';
  }

  private extractEntities(specification: string): Entity[] {
    const entities: Entity[] = [];
    const entityPattern = /(?:model|entity|table|collection|object)\s+(\w+)(?:\s*\{([^}]+)\})?/gi;

    let match;
    while ((match = entityPattern.exec(specification)) !== null) {
      const name = match[1];
      const fieldsText = match[2] || '';

      entities.push({
        name,
        description: `The ${name} entity`,
        fields: this.parseEntityFields(fieldsText, name),
        isUser: name.toLowerCase().includes('user')
      });
    }

    return entities;
  }

  private parseEntityFields(fieldsText: string, entityName: string): EntityField[] {
    const fields: EntityField[] = [];

    if (!fieldsText) {
      // For user entities, add default fields
      if (entityName.toLowerCase() === 'user' || entityName.toLowerCase() === 'users') {
        fields.push(
          { name: 'id', type: FieldType.STRING, required: true, description: 'Unique identifier' },
          { name: 'email', type: FieldType.EMAIL, required: true, description: 'User email' },
          { name: 'password', type: FieldType.STRING, required: true, description: 'Hashed password' },
          { name: 'name', type: FieldType.STRING, required: true, description: 'User full name' },
          { name: 'createdAt', type: FieldType.DATE, required: true, description: 'Creation timestamp' }
        );
      }
    } else {
      const fieldLines = fieldsText.split(/[,;]/);
      for (const line of fieldLines) {
        const trimmed = line.trim();
        if (trimmed) {
          const fieldMatch = /(\w+)\s*:\s*(\w+)(\?)?/.exec(trimmed);
          if (fieldMatch) {
            const name = fieldMatch[1];
            const type = this.mapFieldType(fieldMatch[2]);
            const required = !fieldMatch[3];

            fields.push({
              name,
              type,
              required,
              description: `${name} field`
            });
          }
        }
      }
    }

    return fields;
  }

  private mapFieldType(typeStr: string): FieldType {
    const lower = typeStr.toLowerCase();

    if (['string', 'str', 'text'].includes(lower)) return FieldType.STRING;
    if (['number', 'int', 'integer', 'float', 'double'].includes(lower)) return FieldType.NUMBER;
    if (['boolean', 'bool'].includes(lower)) return FieldType.BOOLEAN;
    if (['date', 'datetime', 'timestamp'].includes(lower)) return FieldType.DATE;
    if (['email'].includes(lower)) return FieldType.EMAIL;
    if (['url', 'uri'].includes(lower)) return FieldType.URL;
    if (['array', 'list'].includes(lower)) return FieldType.ARRAY;
    if (['object', 'json'].includes(lower)) return FieldType.OBJECT;

    return FieldType.STRING;
  }

  private extractRelationships(specification: string): Relationship[] {
    const relationships: Relationship[] = [];
    const relPattern = /(\w+)\s+(?:has|contains|references)\s+(?:many\s+)?(\w+)/gi;

    let match;
    while ((match = relPattern.exec(specification)) !== null) {
      const isMany = specification.substring(match.index, match.index + match[0].length).toLowerCase().includes('many');
      relationships.push({
        from: match[1],
        to: match[2],
        type: isMany ? 'one-to-many' : 'one-to-one',
        description: `${match[1]} is related to ${match[2]}`
      });
    }

    return relationships;
  }

  private extractApiEndpoints(specification: string): ApiEndpoint[] {
    const endpoints: ApiEndpoint[] = [];
    const endpointPattern = /(?:endpoint|route|path)?\s*(?:POST|GET|PUT|DELETE|PATCH)?\s*\/[\w\/-]*/gi;

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    let defaultMethod = 'GET';

    for (const method of methods) {
      const pattern = new RegExp(`(${method})\\s+([\\w\\/\\-{}:]+)`, 'gi');
      let match;
      while ((match = pattern.exec(specification)) !== null) {
        endpoints.push({
          path: match[2],
          method: match[1] as any,
          description: `${match[1]} endpoint for ${match[2]}`,
          authentication: /(?:auth|token|jwt|bearer)/.test(specification.substring(match.index, match.index + 100))
        });
      }
    }

    return endpoints;
  }

  private extractAuthMethods(specification: string): AuthMethod[] {
    const methods: AuthMethod[] = [];
    const lower = specification.toLowerCase();

    if (this.matchesKeywords(lower, ['jwt', 'json web token'])) {
      methods.push({ type: 'jwt', description: 'JWT token-based authentication' });
    }
    if (this.matchesKeywords(lower, ['oauth', 'oauth2'])) {
      methods.push({ type: 'oauth2', description: 'OAuth2 authentication' });
    }
    if (this.matchesKeywords(lower, ['session', 'cookie'])) {
      methods.push({ type: 'session', description: 'Session-based authentication' });
    }
    if (this.matchesKeywords(lower, ['basic auth', 'basic authentication'])) {
      methods.push({ type: 'basic', description: 'Basic HTTP authentication' });
    }
    if (this.matchesKeywords(lower, ['api key'])) {
      methods.push({ type: 'api-key', description: 'API key authentication' });
    }

    // Default to JWT if no auth method specified but authentication is mentioned
    if (methods.length === 0 && this.matchesKeywords(lower, ['auth', 'login', 'secure'])) {
      methods.push({ type: 'jwt', description: 'JWT token-based authentication' });
    }

    return methods;
  }

  private extractDeploymentTargets(specification: string): DeploymentTarget[] {
    const targets: DeploymentTarget[] = [];
    const lower = specification.toLowerCase();

    if (this.matchesKeywords(lower, ['docker', 'container', 'containerize'])) {
      targets.push({ type: 'docker', environment: 'development' });
      targets.push({ type: 'docker', environment: 'production' });
    }
    if (this.matchesKeywords(lower, ['kubernetes', 'k8s'])) {
      targets.push({ type: 'kubernetes', environment: 'production' });
    }
    if (this.matchesKeywords(lower, ['serverless', 'lambda', 'functions'])) {
      targets.push({ type: 'serverless', environment: 'production', platform: 'aws' });
    }
    if (this.matchesKeywords(lower, ['heroku', 'vercel', 'netlify'])) {
      targets.push({ type: 'traditional', environment: 'production', platform: 'heroku' });
    }

    // Default deployment target
    if (targets.length === 0) {
      targets.push({ type: 'docker', environment: 'development' });
      targets.push({ type: 'docker', environment: 'production' });
    }

    return targets;
  }

  private matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }
}

export default new RequirementAnalyzer();
