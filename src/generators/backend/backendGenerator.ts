/**
 * Backend Code Generator
 * Generates Express.js backend code
 */

import { GenerationContext, GeneratedFile } from '../../types';

export class BackendGenerator {
  async generate(context: GenerationContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Root files
    files.push(this.generatePackageJson());
    files.push(this.generateTsConfig());
    files.push(this.generateEnvExample());

    // Source structure
    files.push(...this.generateMainFiles(context));
    files.push(...this.generateMiddleware());
    files.push(...this.generateControllers(context));
    files.push(...this.generateRoutes(context));
    files.push(...this.generateServices(context));
    files.push(...this.generateModels(context));
    files.push(...this.generateUtilities());

    return files;
  }

  private generateMainFiles(context: GenerationContext): GeneratedFile[] {
    return [
      {
        path: 'backend/src/index.ts',
        content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;
`,
        fileType: 'code'
      },
      {
        path: 'backend/src/config/database.ts',
        content: `import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
`,
        fileType: 'code'
      },
      {
        path: 'backend/src/config/environment.ts',
        content: `import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000'),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379'
};

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

export default config;
`,
        fileType: 'code'
      }
    ];
  }

  private generateMiddleware(): GeneratedFile[] {
    return [
      {
        path: 'backend/src/middleware/auth.ts',
        content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
`,
        fileType: 'code'
      },
      {
        path: 'backend/src/middleware/errorHandler.ts',
        content: `import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(\`Error: \${status} - \${message}\`);

  res.status(status).json({
    error: {
      status,
      message,
      timestamp: new Date()
    }
  });
};

export default errorHandler;
`,
        fileType: 'code'
      },
      {
        path: 'backend/src/middleware/validation.ts',
        content: `import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details.map(d => d.message).join(', ')
      });
    }

    req.body = value;
    next();
  };
};
`,
        fileType: 'code'
      }
    ];
  }

  private generateControllers(context: GenerationContext): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    files.push({
      path: 'backend/src/controllers/authController.ts',
      content: `import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/environment';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

const generateToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email, role: 'user' }, config.jwtSecret, {
    expiresIn: config.jwtExpiry
  });
};

export const register = async (req: Response, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = \$1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (\$1, \$2, \$3) RETURNING id, email, name',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.email);

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Response, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = \$1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE id = \$1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
`,
        fileType: 'code'
      });

    // Generate entity controllers
    for (const entity of context.analysis.entities.filter(e => !e.isUser)) {
      const tableName = entity.name.toLowerCase() + 's';
      const idField = 'id';

      files.push({
        path: `backend/src/controllers/${entity.name}Controller.ts`,
        content: `import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ${tableName} ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ${entity.name.toLowerCase()}s' });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM ${tableName} WHERE ${idField} = \$1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '${entity.name} not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ${entity.name.toLowerCase()}' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => \`\\\$\${i + 1}\`).join(', ');

    const result = await pool.query(
      \`INSERT INTO ${tableName} (\${columns.join(', ')}) VALUES (\${placeholders}) RETURNING *\`,
      values
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ${entity.name.toLowerCase()}' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => \`\${col} = \\\$\${i + 1}\`).join(', ');

    const result = await pool.query(
      \`UPDATE ${tableName} SET \${setClause} WHERE ${idField} = \\\$\${columns.length + 1} RETURNING *\`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '${entity.name} not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ${entity.name.toLowerCase()}' });
  }
};

export const delete_ = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM ${tableName} WHERE ${idField} = \$1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '${entity.name} not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ${entity.name.toLowerCase()}' });
  }
};
`,
        fileType: 'code'
      });
    }

    return files;
  }

  private generateRoutes(context: GenerationContext): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    files.push({
      path: 'backend/src/routes/authRoutes.ts',
      content: `import express from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
`,
        fileType: 'code'
      });

    let apiRoutesContent = `import express from 'express';
import { authenticate } from '../middleware/auth';
`;

    for (const entity of context.analysis.entities.filter(e => !e.isUser)) {
      apiRoutesContent += `import * as ${entity.name}Controller from '../controllers/${entity.name}Controller';\n`;
    }

    apiRoutesContent += `
const router = express.Router();

`;

    for (const entity of context.analysis.entities.filter(e => !e.isUser)) {
      const tableName = entity.name.toLowerCase() + 's';
      apiRoutesContent += `
// ${entity.name} routes
router.get('/${tableName}', authenticate, ${entity.name}Controller.getAll);
router.get('/${tableName}/:id', authenticate, ${entity.name}Controller.getById);
router.post('/${tableName}', authenticate, ${entity.name}Controller.create);
router.put('/${tableName}/:id', authenticate, ${entity.name}Controller.update);
router.delete('/${tableName}/:id', authenticate, ${entity.name}Controller.delete_);
`;
    }

    apiRoutesContent += `
export default router;
`;

    files.push({
      path: 'backend/src/routes/apiRoutes.ts',
      content: apiRoutesContent,
      fileType: 'code'
    });

    return files;
  }

  private generateServices(context: GenerationContext): GeneratedFile[] {
    return [];
  }

  private generateModels(context: GenerationContext): GeneratedFile[] {
    return [];
  }

  private generateUtilities(): GeneratedFile[] {
    return [];
  }

  private generatePackageJson(): GeneratedFile {
    return {
      path: 'backend/package.json',
      content: JSON.stringify({
        name: 'backend',
        version: '1.0.0',
        scripts: {
          build: 'tsc',
          start: 'node dist/index.js',
          dev: 'ts-node src/index.ts',
          migrate: 'node dist/scripts/migrate.js'
        },
        dependencies: {
          express: '^4.18.2',
          cors: '^2.8.5',
          helmet: '^7.1.0',
          compression: '^1.7.4',
          morgan: '^1.10.0',
          'dotenv': '^16.3.1',
          'jsonwebtoken': '^9.1.0',
          'bcryptjs': '^2.4.3',
          'pg': '^8.11.3',
          'redis': '^4.6.12'
        },
        devDependencies: {
          '@types/node': '^20.10.0',
          '@types/express': '^4.17.21',
          'typescript': '^5.3.3',
          'ts-node': '^10.9.2'
        }
      }, null, 2),
      fileType: 'config'
    };
  }

  private generateTsConfig(): GeneratedFile {
    return {
      path: 'backend/tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          module: 'commonjs',
          lib: ['ES2020'],
          outDir: './dist',
          rootDir: './src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true
        },
        include: ['src/**/*'],
        exclude: ['node_modules']
      }, null, 2),
      fileType: 'config'
    };
  }

  private generateEnvExample(): GeneratedFile {
    return {
      path: 'backend/.env.example',
      content: `NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/appdb
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-secret-key-change-in-production
JWT_EXPIRY=24h
FRONTEND_URL=http://localhost:3000
`,
      fileType: 'config'
    };
  }
}
