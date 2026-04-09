# Advanced Feature Examples

Comprehensive examples of advanced features and customizations for generated applications.

---

## Authentication & Authorization

### JWT Token Example

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "550e8400-e29b-41d4-a716-446655440001",
    "email": "john@example.com",
    "name": "John Smith",
    "roles": ["admin", "user"],
    "permissions": ["read:tasks", "write:tasks", "delete:tasks", "manage:users"],
    "iat": 1708420800,
    "exp": 1708507200,
    "iss": "codegen-system",
    "aud": "codegen-app"
  }
}
```

### Token Refresh Flow

```
Client Request
    ↓
Check Token Expiry
    ↓
If Expired:
  Send Refresh Token → Server
    ↓
  Validate & Issue New Access Token
    ↓
If Valid:
  Proceed with Request
    ↓
Return Data/Response
```

### Role-Based Access Control

```typescript
enum UserRole {
  ADMIN = 'admin',           // Full access
  MANAGER = 'manager',       // Team management
  USER = 'user',            // Basic access
  GUEST = 'guest'           // Read-only
}

const permissions = {
  admin: ['read:all', 'write:all', 'delete:all', 'manage:all'],
  manager: ['read:team', 'write:team', 'delete:own', 'manage:team'],
  user: ['read:own', 'write:own', 'delete:own'],
  guest: ['read:public']
};
```

---

## Real-Time Features

### WebSocket Events

```javascript
// Server to Client
{
  type: 'task.created',
  data: {
    id: 'task-123',
    title: 'New task',
    projectId: 'proj-456'
  },
  timestamp: '2024-02-20T10:30:00Z'
}

{
  type: 'task.updated',
  data: {
    id: 'task-123',
    status: 'in-progress'
  },
  timestamp: '2024-02-20T10:31:00Z'
}

{
  type: 'comment.added',
  data: {
    taskId: 'task-123',
    authorId: 'user-456',
    content: 'Started working on this'
  },
  timestamp: '2024-02-20T10:32:00Z'
}

// Client to Server
{
  type: 'user.typing',
  taskId: 'task-123',
  userId: 'user-789'
}

{
  type: 'user.cursor_position',
  taskId: 'task-123',
  position: { line: 5, column: 12 }
}
```

---

## Caching Strategy

### Redis Cache Patterns

```javascript
// Cache Key Patterns
const cacheKeys = {
  users: (id) => `user:${id}`,
  tasks: (id) => `task:${id}`,
  projects: (id) => `project:${id}`,
  userTasks: (userId) => `user:${userId}:tasks`,
  projectTasks: (projectId) => `project:${projectId}:tasks`,
  leaderboard: 'leaderboard:weekly'
};

// Cache Expiry
const cacheTTL = {
  user: 3600,           // 1 hour
  task: 1800,          // 30 minutes
  project: 3600,        // 1 hour
  list: 600,           // 10 minutes
  leaderboard: 86400   // 24 hours
};

// Example Cache Operations
redis.setex('user:123', 3600, JSON.stringify(userData));
redis.get('user:123', (err, data) => {
  if (data) return JSON.parse(data);
});
redis.del('user:123');  // Invalidate
```

---

## Advanced Query Features

### Complex Filtering

```javascript
// MongoDB Style
{
  $filter: {
    status: { $in: ['todo', 'in-progress'] },
    priority: { $gte: 'high' },
    dueDate: { $lte: '2024-03-01' },
    assignedTo: { $exists: true },
    tags: { $all: ['urgent', 'frontend'] }
  },
  $sort: { priority: -1, dueDate: 1 },
  $pagination: { page: 1, limit: 20 }
}

// Generated SQL
SELECT * FROM tasks 
WHERE status IN ('todo', 'in-progress')
  AND priority >= 'high'
  AND due_date <= '2024-03-01'
  AND assigned_to IS NOT NULL
  AND tags @> ARRAY['urgent', 'frontend']
ORDER BY priority DESC, due_date ASC
LIMIT 20 OFFSET 0;
```

### Full-Text Search

```sql
-- Create search index
CREATE INDEX idx_task_search ON tasks 
USING GIN (to_tsvector('english', title || ' ' || description));

-- Search query
SELECT * FROM tasks 
WHERE to_tsvector('english', title || ' ' || description) 
  @@ plainto_tsquery('english', 'design homepage');
```

---

## Notification System

### Notification Types

```javascript
const notifications = [
  {
    id: 'notif-001',
    type: 'task_assigned',
    title: 'New task assigned',
    message: 'Design new homepage',
    recipient: 'mike@example.com',
    actor: 'sarah@example.com',
    actionUrl: '/tasks/123',
    priority: 'high',
    read: false,
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'notif-002',
    type: 'task_due_soon',
    title: 'Task due in 2 days',
    message: 'Finish homepage design',
    recipient: 'mike@example.com',
    actionUrl: '/tasks/123',
    priority: 'medium',
    read: false,
    createdAt: '2024-02-20T09:00:00Z'
  },
  {
    id: 'notif-003',
    type: 'comment_reply',
    title: 'New comment on your task',
    message: 'Sarah replied to your comment',
    recipient: 'mike@example.com',
    actor: 'sarah@example.com',
    actionUrl: '/tasks/123#comment-456',
    priority: 'normal',
    read: true,
    createdAt: '2024-02-20T08:30:00Z'
  }
];
```

### Email Templates

```html
<!-- Task Assignment Notification -->
<h2>Hello {{userName}},</h2>
<p>You've been assigned a new task:</p>
<div style="border: 1px solid #ccc; padding: 15px; margin: 20px 0;">
  <strong>{{taskTitle}}</strong>
  <p>{{taskDescription}}</p>
  <p>Due: {{dueDate}}</p>
  <p>Priority: {{priority}}</p>
</div>
<a href="{{actionUrl}}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
  View Task
</a>
```

---

## File Management

### File Upload Handler

```javascript
// Multipart Form Data
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('taskId', 'task-123');
formData.append('description', 'Design mockups');

// Upload API
POST /api/files/upload
Content-Type: multipart/form-data

Response:
{
  id: 'file-789',
  filename: 'mockup.pdf',
  size: 1024576,
  mimeType: 'application/pdf',
  url: '/files/mockup.pdf',
  uploadedAt: '2024-02-20T10:00:00Z',
  uploadedBy: 'user-123'
}
```

### File Storage

```typescript
// S3 Configuration
const s3Config = {
  bucket: 'codegen-files',
  region: 'us-east-1',
  keyPrefix: 'uploads/',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'video/mp4',
    'application/msword'
  ]
};

// Local Storage Fallback
const localStorageConfig = {
  uploadDir: './uploads',
  maxFileSize: 50 * 1024 * 1024,
  retentionDays: 90
};
```

---

## Audit & Logging

### Audit Log Example

```json
{
  "id": "audit-001",
  "timestamp": "2024-02-20T10:15:30Z",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "userName": "john@example.com",
  "action": "task.updated",
  "resource": {
    "type": "task",
    "id": "task-123",
    "name": "Design homepage"
  },
  "changes": {
    "status": {
      "old": "todo",
      "new": "in-progress"
    },
    "assignedTo": {
      "old": null,
      "new": "user-456"
    }
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "status": "success"
}
```

### Log Levels

```typescript
// Development
logger.debug('Database query executed', { query, duration: 125 });
logger.info('User login successful', { userId: '123', timestamp });
logger.warn('High memory usage detected', { usage: '85%' });
logger.error('Database connection failed', { error, retryAttempt: 3 });

// Production
logger.info('Application started', { version: '1.0.0', env: 'production' });
logger.warn('Rate limit approaching', { endpoint, requests: 950, limit: 1000 });
logger.error('Payment processing failed', { orderId, error: 'timeout' });
```

---

## Performance Optimization

### Caching Layers

```
Request
  ↓
Browser Cache (HTTP Headers)
  ↓
CDN Cache (if configured)
  ↓
Server Cache (Redis)
  ↓
Database Query Cache
  ↓
Primary Database
```

### Query Optimization

```sql
-- Before (3 seconds)
SELECT t.* FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN users u ON t.assigned_to = u.id
WHERE t.status = 'in-progress'
ORDER BY t.due_date;

-- After (300ms) - with indexes
CREATE INDEX idx_tasks_status_due ON tasks(status, due_date);
CREATE INDEX idx_projects_id ON projects(id);
CREATE INDEX idx_users_id ON users(id);

SELECT t.* FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN users u ON t.assigned_to = u.id
WHERE t.status = 'in-progress'
ORDER BY t.due_date;
```

---

## Error Handling

### Standard Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Must be at least 8 characters"
      }
    ],
    "timestamp": "2024-02-20T10:00:00Z",
    "requestId": "req-123456"
  }
}
```

### Error Classes

```typescript
class APIError extends Error {
  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

class ValidationError extends APIError {
  constructor(message: string, details: any[]) {
    super('VALIDATION_ERROR', message, 400);
    this.details = details;
  }
}

class NotFoundError extends APIError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

class UnauthorizedError extends APIError {
  constructor() {
    super('UNAUTHORIZED', 'Authentication required', 401);
  }
}
```

---

## Testing Examples

### Unit Test Example

```typescript
describe('TaskService', () => {
  let service: TaskService;
  let repository: TaskRepository;

  beforeEach(() => {
    repository = mock(TaskRepository);
    service = new TaskService(repository);
  });

  it('should create a task with valid data', async () => {
    const taskData = {
      title: 'Test task',
      projectId: 'proj-123',
      status: 'todo'
    };
    
    when(repository.create(taskData)).thenResolve({
      id: 'task-123',
      ...taskData,
      createdAt: new Date()
    });

    const result = await service.createTask(taskData);
    
    expect(result.id).toBe('task-123');
    expect(result.title).toBe('Test task');
  });
});
```

### Integration Test Example

```typescript
describe('Task API', () => {
  let app: Express.Application;
  let db: Database;

  beforeAll(async () => {
    app = createApp();
    db = await connectTestDatabase();
  });

  it('POST /api/tasks should create a task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Integration test task',
        projectId: 'proj-123'
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });
});
```

---

## Monitoring & Metrics

### Application Metrics

```javascript
const metrics = {
  // Request metrics
  'requests.total': 15847,
  'requests.success': 15420,
  'requests.error': 427,
  'requests.average_duration_ms': 123,
  
  // User metrics
  'users.total': 3245,
  'users.active_30d': 2100,
  'users.new_today': 45,
  
  // Business metrics
  'orders.total': 543,
  'orders.revenue': 24580,
  'orders.average_value': 45.25,
  
  // System metrics
  'database.connections': 25,
  'database.query_time_ms': 85,
  'cache.hit_rate': 0.82,
  'memory.usage_percent': 68
};
```

---

## Deployment Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/codegen
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=5000

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d

# File Storage
STORAGE_TYPE=s3  # or local
S3_BUCKET=codegen-files
S3_REGION=us-east-1
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Email
EMAIL_SERVICE=sendgrid  # or smtp
SENDGRID_API_KEY=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=

# API
API_PORT=5000
API_HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000

# Features
ENABLE_NOTIFICATIONS=true
ENABLE_WEBHOOKS=true
ENABLE_REAL_TIME=true
```

---

## API Rate Limiting

```javascript
const rateLimits = {
  '/api/auth/login': { points: 5, duration: 900 },      // 5 req/15 min
  '/api/tasks': { points: 100, duration: 60 },          // 100 req/min
  '/api/upload': { points: 20, duration: 3600 },        // 20 req/hour
  '/api/reports': { points: 50, duration: 3600 },       // 50 req/hour
  default: { points: 1000, duration: 3600 }             // 1000 req/hour
};
```

---

## Webhook Configuration

```javascript
const webhooks = [
  {
    id: 'webhook-001',
    event: 'task.created',
    url: 'https://external-service.com/webhooks/tasks',
    headers: { 'Authorization': 'Bearer secret-key' },
    active: true
  },
  {
    id: 'webhook-002',
    event: 'order.completed',
    url: 'https://shipping-service.com/orders',
    retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
    active: true
  }
];

// Webhook Payload
{
  event: 'task.created',
  timestamp: '2024-02-20T10:00:00Z',
  data: {
    id: 'task-123',
    title: 'New task',
    projectId: 'proj-456'
  }
}
```
