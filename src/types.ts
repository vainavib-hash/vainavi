/**
 * Core type definitions for the code generation system
 */

export interface Requirement {
  id: string;
  description: string;
  type: RequirementType;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
}

export enum RequirementType {
  FUNCTIONAL = 'functional',
  NON_FUNCTIONAL = 'non_functional',
  SECURITY = 'security',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  API = 'api',
  DEPLOYMENT = 'deployment'
}

export interface AnalysisResult {
  requirements: Requirement[];
  entities: Entity[];
  relationships: Relationship[];
  apiEndpoints: ApiEndpoint[];
  authMethods: AuthMethod[];
  deploymentTargets: DeploymentTarget[];
}

export interface Entity {
  name: string;
  description: string;
  fields: EntityField[];
  isUser?: boolean;
}

export interface EntityField {
  name: string;
  type: FieldType;
  required: boolean;
  description: string;
  validation?: string;
  defaultValue?: unknown;
}

export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  EMAIL = 'email',
  URL = 'url',
  ENUM = 'enum',
  REFERENCE = 'reference',
  ARRAY = 'array',
  OBJECT = 'object'
}

export interface Relationship {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  description: string;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requestBody?: RequestSchema;
  responseBody?: ResponseSchema;
  authentication?: boolean;
  authorization?: string[];
}

export interface RequestSchema {
  fields: SchemaField[];
}

export interface ResponseSchema {
  fields: SchemaField[];
  statusCodes: Record<number, string>;
}

export interface SchemaField {
  name: string;
  type: FieldType;
  required: boolean;
  description: string;
}

export interface AuthMethod {
  type: 'jwt' | 'oauth2' | 'basic' | 'session' | 'api-key';
  description: string;
  options?: Record<string, unknown>;
}

export interface DeploymentTarget {
  type: 'docker' | 'kubernetes' | 'serverless' | 'traditional';
  environment: string;
  platform?: string;
}

export interface Architecture {
  frontend: FrontendArchitecture;
  backend: BackendArchitecture;
  database: DatabaseArchitecture;
  deployment: DeploymentArchitecture;
}

export interface FrontendArchitecture {
  framework: 'react' | 'vue' | 'angular' | 'svelte';
  styling: 'tailwind' | 'material-ui' | 'bootstrap' | 'styled-components';
  stateManagement: 'redux' | 'vuex' | 'ngx-store' | 'context-api' | 'none';
  features: string[];
  pages: PageDefinition[];
}

export interface PageDefinition {
  name: string;
  path: string;
  components: string[];
  description: string;
}

export interface BackendArchitecture {
  framework: 'express' | 'fastapi' | 'spring-boot' | 'django' | 'nest.js';
  language: 'javascript' | 'python' | 'java' | 'typescript';
  apiStyle: 'rest' | 'graphql' | 'grpc';
  authentication: AuthMethod;
  middleware: string[];
  errorHandling: string;
}

export interface DatabaseArchitecture {
  type: 'sql' | 'nosql' | 'hybrid';
  primary: 'postgresql' | 'mysql' | 'mongodb' | 'dynamodb' | 'firestore';
  secondary?: string;
  caching: 'redis' | 'memcached' | 'none';
}

export interface DeploymentArchitecture {
  platform: string;
  containerization: boolean;
  cicd: boolean;
  monitoring: boolean;
  loadBalancing: boolean;
  configuration: Record<string, unknown>;
}

export interface GenerationConfig {
  outputDir: string;
  projectName: string;
  architecture: Architecture;
  includeTests: boolean;
  includeDocs: boolean;
  gitIgnore: boolean;
  envExample: boolean;
}

export interface GeneratedProject {
  structure: FileStructure;
  files: GeneratedFile[];
  documentation: string;
  deploymentGuide: string;
}

export interface FileStructure {
  [key: string]: DirectoryNode | string;
}

export interface DirectoryNode {
  type: 'directory';
  children: Record<string, DirectoryNode | string>;
}

export interface GeneratedFile {
  path: string;
  content: string;
  fileType: 'code' | 'config' | 'documentation' | 'script';
}

export interface GenerationContext {
  analysis: AnalysisResult;
  architecture: Architecture;
  config: GenerationConfig;
}
