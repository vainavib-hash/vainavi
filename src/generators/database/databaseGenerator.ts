/**
 * Database Code Generator
 * Generates database schema and migrations
 */

import { GenerationContext, GeneratedFile, FieldType } from '../../types';

export class DatabaseGenerator {
  async generate(context: GenerationContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate schema files
    files.push(this.generateInitialSchema(context));
    files.push(...this.generateMigrationScripts(context));
    files.push(this.generateSeedScript(context));
    files.push(this.generateDbConfig());

    return files;
  }

  private generateInitialSchema(context: GenerationContext): GeneratedFile {
    let schema = `-- Initial database schema\n\n`;

    // Create users table first
    schema += `CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

`;

    // Create entity tables
    for (const entity of context.analysis.entities.filter(e => !e.isUser)) {
      const tableName = entity.name.toLowerCase() + 's';
      schema += this.generateTableSchema(tableName, entity.name, context);
      schema += '\n';
    }

    // Add indexes for foreign keys
    for (const rel of context.analysis.relationships) {
      const fromTable = rel.from.toLowerCase() + 's';
      const toTable = rel.to.toLowerCase() + 's';
      schema += `CREATE INDEX idx_${fromTable}_${toTable}_id ON ${fromTable}(${rel.to.toLowerCase()}_id);\n`;
    }

    return {
      path: 'database/migrations/001_initial_schema.sql',
      content: schema,
      fileType: 'config'
    };
  }

  private generateTableSchema(tableName: string, entityName: string, context: GenerationContext): string {
    const entity = context.analysis.entities.find(e => e.name === entityName);
    if (!entity) return '';

    let schema = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
    const columns: string[] = [];

    // Add ID column
    columns.push('  id UUID PRIMARY KEY DEFAULT gen_random_uuid()');

    // Add entity-specific fields
    for (const field of entity.fields) {
      const sqlType = this.mapFieldTypeToSQL(field.type);
      const nullable = field.required ? 'NOT NULL' : 'NULL';
      const defaultValue = field.defaultValue ? ` DEFAULT '${field.defaultValue}'` : '';

      columns.push(`  ${field.name} ${sqlType} ${nullable}${defaultValue}`);
    }

    // Add timestamps
    columns.push('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    columns.push('  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    columns.push('  deleted_at TIMESTAMP');

    // Add foreign key relationships
    for (const rel of context.analysis.relationships.filter(r => r.from === entityName)) {
      const refTable = rel.to.toLowerCase() + 's';
      const fkColumn = `${rel.to.toLowerCase()}_id`;
      columns.push(`  ${fkColumn} UUID REFERENCES ${refTable}(id)`);
    }

    schema += columns.join(',\n');
    schema += '\n);\n';

    // Add indexes
    schema += `\nCREATE INDEX idx_${tableName}_created_at ON ${tableName}(created_at DESC);\n`;
    if (entity.fields.some(f => f.type === FieldType.EMAIL)) {
      const emailField = entity.fields.find(f => f.type === FieldType.EMAIL);
      if (emailField) {
        schema += `CREATE INDEX idx_${tableName}_${emailField.name} ON ${tableName}(${emailField.name});\n`;
      }
    }

    return schema;
  }

  private mapFieldTypeToSQL(type: FieldType): string {
    switch (type) {
      case FieldType.STRING:
      case FieldType.EMAIL:
      case FieldType.URL:
        return 'VARCHAR(255)';
      case FieldType.NUMBER:
        return 'NUMERIC';
      case FieldType.BOOLEAN:
        return 'BOOLEAN';
      case FieldType.DATE:
        return 'TIMESTAMP';
      case FieldType.ARRAY:
        return 'TEXT[]';
      case FieldType.OBJECT:
        return 'JSONB';
      case FieldType.ENUM:
        return 'VARCHAR(50)';
      default:
        return 'VARCHAR(255)';
    }
  }

  private generateMigrationScripts(context: GenerationContext): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // Create migration runner script
    files.push({
      path: 'database/scripts/migrate.js',
      content: `const fs = require('fs');
const path = require('path');
const pg = require('pg');

const connectionString = process.env.DATABASE_URL;
const migrationsDir = path.join(__dirname, '../migrations');

async function runMigrations() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get all migration files
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(\`Running migration: \${file}\`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      await client.query(sql);
      console.log(\`✓ Completed: \${file}\`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
`,
      fileType: 'script'
    });

    return files;
  }

  private generateSeedScript(context: GenerationContext): GeneratedFile {
    return {
      path: 'database/scripts/seed.js',
      content: `const pg = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;

async function seedDatabase() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to database, starting seed...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await client.query(
      'INSERT INTO users (email, password, name) VALUES (\$1, \$2, \$3) ON CONFLICT DO NOTHING',
      ['admin@example.com', hashedPassword, 'Admin User']
    );

    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDatabase();
`,
      fileType: 'script'
    };
  }

  private generateDbConfig(): GeneratedFile {
    return {
      path: 'database/README.md',
      content: `# Database Setup

## Prerequisites
- PostgreSQL 13+
- Node.js with pg and bcryptjs packages

## Setup Instructions

### 1. Create Database

\`\`\`bash
createdb appdb
\`\`\`

### 2. Set Environment Variables

\`\`\`bash
export DATABASE_URL=postgresql://user:password@localhost:5432/appdb
\`\`\`

### 3. Run Migrations

\`\`\`bash
node scripts/migrate.js
\`\`\`

### 4. Seed Initial Data (Optional)

\`\`\`bash
node scripts/seed.js
\`\`\`

## Backup and Restore

### Backup Database

\`\`\`bash
pg_dump $DATABASE_URL -Fc -f backup.dump
\`\`\`

### Restore Database

\`\`\`bash
pg_restore -d appdb backup.dump
\`\`\`

## Schema Management

All migrations are in the \`migrations/\` directory and are run in numerical order.

## Connection Pooling

The application uses connection pooling for better performance:
- Maximum connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 5 seconds
`,
      fileType: 'documentation'
    };
  }
}
