# API Response Examples & Mock Data

Complete API request/response examples with real-world data.

---

## Authentication Endpoints

### Register User

**Request:**
```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "SecurePass123!@#",
  "name": "John Smith",
  "organizationName": "Acme Corp"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "john@company.com",
      "name": "John Smith",
      "role": "owner",
      "verified": false,
      "createdAt": "2024-02-20T10:00:00Z"
    },
    "organization": {
      "id": "org-001",
      "name": "Acme Corp",
      "plan": "free",
      "createdAt": "2024-02-20T10:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400
    }
  }
}
```

### Login User

**Request:**
```json
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "SecurePass123!@#"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "john@company.com",
      "name": "John Smith",
      "role": "owner",
      "organizationId": "org-001"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400
    }
  }
}
```

---

## Task Management Endpoints

### Create Task

**Request:**
```json
POST /api/v1/projects/proj-123/tasks
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication with 2FA support",
  "type": "feature",
  "priority": "high",
  "assignees": ["550e8400-e29b-41d4-a716-446655440002"],
  "dueDate": "2024-03-15",
  "storyPoints": 8,
  "tags": ["backend", "security"],
  "customFields": {
    "module": "auth",
    "riskLevel": "high"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "task-001",
    "key": "PROJ-456",
    "projectId": "proj-123",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication with 2FA support",
    "type": "feature",
    "status": "todo",
    "priority": "high",
    "assignees": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Sarah Johnson",
        "email": "sarah@company.com"
      }
    ],
    "dueDate": "2024-03-15",
    "storyPoints": 8,
    "tags": ["backend", "security"],
    "customFields": {
      "module": "auth",
      "riskLevel": "high"
    },
    "attachments": [],
    "comments": [],
    "watchers": ["550e8400-e29b-41d4-a716-446655440001"],
    "dependencies": [],
    "createdBy": "550e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2024-02-20T10:15:00Z",
    "updatedAt": "2024-02-20T10:15:00Z"
  }
}
```

### List Tasks with Filters

**Request:**
```json
GET /api/v1/projects/proj-123/tasks?status=in-progress&priority=high&assignee=550e8400-e29b-41d4-a716-446655440002&sort=-dueDate&limit=20&offset=0
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task-001",
        "key": "PROJ-456",
        "title": "Implement user authentication",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2024-03-15",
        "assignees": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440002",
            "name": "Sarah Johnson",
            "avatar": "https://api.example.com/avatars/sarah.jpg"
          }
        ],
        "createdAt": "2024-02-20T10:15:00Z",
        "updatedAt": "2024-02-20T14:30:00Z"
      },
      {
        "id": "task-002",
        "key": "PROJ-457",
        "title": "API rate limiting implementation",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2024-03-10",
        "assignees": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440002",
            "name": "Sarah Johnson"
          }
        ],
        "createdAt": "2024-02-19T09:00:00Z",
        "updatedAt": "2024-02-20T11:45:00Z"
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### Update Task

**Request:**
```json
PUT /api/v1/tasks/task-001
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "status": "in-progress",
  "progress": 65,
  "assignees": [
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ],
  "estimatedHours": 40,
  "actualHours": 26
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task-001",
    "key": "PROJ-456",
    "title": "Implement user authentication",
    "status": "in-progress",
    "progress": 65,
    "assignees": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Sarah Johnson"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "name": "Mike Williams"
      }
    ],
    "estimatedHours": 40,
    "actualHours": 26,
    "updatedAt": "2024-02-20T15:00:00Z",
    "updatedBy": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

---

## Comments & Collaboration

### Add Comment

**Request:**
```json
POST /api/v1/tasks/task-001/comments
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "content": "Started implementing the authentication module. Completed database schema setup. @550e8400-e29b-41d4-a716-446655440003 can you review the initial design?",
  "attachments": ["file-001"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "comment-001",
    "taskId": "task-001",
    "author": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Sarah Johnson",
      "email": "sarah@company.com",
      "avatar": "https://api.example.com/avatars/sarah.jpg"
    },
    "content": "<p>Started implementing the authentication module. Completed database schema setup. <a>@Mike Williams</a> can you review the initial design?</p>",
    "mentions": ["550e8400-e29b-41d4-a716-446655440003"],
    "attachments": [
      {
        "id": "file-001",
        "name": "auth-schema.sql",
        "url": "https://api.example.com/files/auth-schema.sql",
        "mimeType": "text/plain"
      }
    ],
    "reactions": {},
    "createdAt": "2024-02-20T15:30:00Z",
    "updatedAt": "2024-02-20T15:30:00Z"
  }
}
```

### Add Comment Reaction

**Request:**
```json
POST /api/v1/comments/comment-001/reactions
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "emoji": "👍"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "reaction-001",
    "commentId": "comment-001",
    "emoji": "👍",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Mike Williams"
    },
    "createdAt": "2024-02-20T16:00:00Z"
  }
}
```

---

## Reporting & Analytics

### Get Dashboard Data

**Request:**
```json
GET /api/v1/workspaces/ws-001/dashboards/dash-001/data?dateRange=7d&teamId=team-001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "dashboard": {
      "id": "dash-001",
      "name": "Q1 Project Overview",
      "widgets": [
        {
          "id": "widget-001",
          "type": "summary",
          "title": "Tasks Summary",
          "data": {
            "totalTasks": 127,
            "completedTasks": 42,
            "inProgressTasks": 56,
            "todoTasks": 29,
            "completionRate": 33
          }
        },
        {
          "id": "widget-002",
          "type": "burndown",
          "title": "Sprint Burndown",
          "data": {
            "sprint": "Sprint 8",
            "startDate": "2024-02-12",
            "endDate": "2024-02-25",
            "totalPoints": 120,
            "remainingPoints": 45,
            "completedPoints": 75,
            "velocity": 18.75,
            "trend": [
              { "date": "2024-02-12", "remaining": 120 },
              { "date": "2024-02-13", "remaining": 108 },
              { "date": "2024-02-14", "remaining": 96 },
              { "date": "2024-02-15", "remaining": 81 },
              { "date": "2024-02-16", "remaining": 75 },
              { "date": "2024-02-20", "remaining": 45 }
            ]
          }
        },
        {
          "id": "widget-003",
          "type": "pie",
          "title": "Tasks by Priority",
          "data": [
            { "label": "Critical", "value": 12, "color": "#dc2626" },
            { "label": "High", "value": 34, "color": "#ea580c" },
            { "label": "Medium", "value": 56, "color": "#eab308" },
            { "label": "Low", "value": 25, "color": "#16a34a" }
          ]
        },
        {
          "id": "widget-004",
          "type": "team_utilization",
          "title": "Team Utilization",
          "data": [
            {
              "member": "Sarah Johnson",
              "tasksAssigned": 12,
              "tasksCompleted": 8,
              "hoursLogged": 42,
              "capacity": 40,
              "utilization": 105
            },
            {
              "member": "Mike Williams",
              "tasksAssigned": 10,
              "tasksCompleted": 6,
              "hoursLogged": 36,
              "capacity": 40,
              "utilization": 90
            }
          ]
        }
      ]
    }
  }
}
```

### Generate Report

**Request:**
```json
POST /api/v1/reports/generate
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "February Project Status",
  "type": "project_status",
  "format": "pdf",
  "dateRange": {
    "from": "2024-02-01",
    "to": "2024-02-29"
  },
  "projectIds": ["proj-123", "proj-124"],
  "includeMetrics": [
    "task_completion_rate",
    "team_velocity",
    "on_time_delivery",
    "quality_metrics"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reportId": "report-001",
    "status": "processing",
    "estimatedCompletionTime": 30,
    "downloadUrl": "https://api.example.com/reports/report-001/download"
  }
}
```

---

## Error Responses

### Validation Error

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "INVALID_EMAIL"
      },
      {
        "field": "password",
        "message": "Password must be at least 12 characters",
        "code": "PASSWORD_TOO_SHORT"
      },
      {
        "field": "organizationName",
        "message": "Organization name is required",
        "code": "REQUIRED_FIELD"
      }
    ]
  }
}
```

### Unauthorized Error

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": {
      "reason": "Invalid or expired token",
      "suggestion": "Please login again"
    }
  }
}
```

### Forbidden Error

**Response (403 Forbidden):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied",
    "details": {
      "resource": "task-001",
      "permission": "write",
      "reason": "You don't have permission to modify this task"
    }
  }
}
```

### Not Found Error

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": {
      "resource": "project",
      "id": "proj-999",
      "suggestion": "Please check the project ID and try again"
    }
  }
}
```

### Rate Limit Error

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "resetAt": "2024-02-20T17:00:00Z",
      "suggestion": "Please wait before retrying"
    }
  },
  "headers": {
    "X-RateLimit-Limit": 1000,
    "X-RateLimit-Remaining": 0,
    "X-RateLimit-Reset": 1708379200
  }
}
```

### Internal Server Error

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "details": {
      "requestId": "req-20240220-15342",
      "timestamp": "2024-02-20T15:30:00Z",
      "support": "Contact support with request ID"
    }
  }
}
```

---

## Webhook Payload Examples

### Task Created Event

```json
{
  "event": "task.created",
  "eventId": "evt-001",
  "timestamp": "2024-02-20T10:15:00Z",
  "data": {
    "task": {
      "id": "task-001",
      "key": "PROJ-456",
      "title": "Implement user authentication",
      "type": "feature",
      "status": "todo",
      "priority": "high",
      "dueDate": "2024-03-15",
      "projectId": "proj-123",
      "createdBy": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "John Smith",
        "email": "john@company.com"
      },
      "assignees": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "name": "Sarah Johnson"
        }
      ]
    }
  },
  "delivery": {
    "attempt": 1,
    "timestamp": "2024-02-20T10:15:01Z"
  }
}
```

### Task Updated Event

```json
{
  "event": "task.updated",
  "eventId": "evt-002",
  "timestamp": "2024-02-20T15:30:00Z",
  "data": {
    "task": {
      "id": "task-001",
      "key": "PROJ-456",
      "title": "Implement user authentication"
    },
    "changes": [
      {
        "field": "status",
        "oldValue": "todo",
        "newValue": "in-progress",
        "changedAt": "2024-02-20T15:30:00Z"
      },
      {
        "field": "assignees",
        "oldValue": ["user-002"],
        "newValue": ["user-002", "user-003"],
        "changedAt": "2024-02-20T15:30:00Z"
      }
    ]
  }
}
```

### Comment Added Event

```json
{
  "event": "comment.added",
  "eventId": "evt-003",
  "timestamp": "2024-02-20T15:45:00Z",
  "data": {
    "comment": {
      "id": "comment-001",
      "taskId": "task-001",
      "author": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Sarah Johnson"
      },
      "content": "Started implementing the authentication module",
      "mentions": ["550e8400-e29b-41d4-a716-446655440003"]
    }
  }
}
```

---

## Pagination Examples

### Request with Pagination

```json
GET /api/v1/projects/proj-123/tasks?limit=20&offset=40&sort=-createdAt
```

### Response with Pagination Metadata

```json
{
  "success": true,
  "data": {
    "tasks": [ /* ... */ ],
    "pagination": {
      "total": 127,
      "limit": 20,
      "offset": 40,
      "page": 3,
      "pageCount": 7,
      "hasMore": true,
      "links": {
        "first": "/api/v1/projects/proj-123/tasks?limit=20&offset=0",
        "prev": "/api/v1/projects/proj-123/tasks?limit=20&offset=20",
        "next": "/api/v1/projects/proj-123/tasks?limit=20&offset=60",
        "last": "/api/v1/projects/proj-123/tasks?limit=20&offset=120"
      }
    }
  }
}
```

---

## Batch Operations

### Batch Update Tasks

**Request:**
```json
POST /api/v1/tasks/batch/update
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "taskIds": ["task-001", "task-002", "task-003"],
  "updates": {
    "status": "in-progress",
    "assignees": ["550e8400-e29b-41d4-a716-446655440002"]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "updated": 3,
    "failed": 0,
    "tasks": [
      { "id": "task-001", "success": true },
      { "id": "task-002", "success": true },
      { "id": "task-003", "success": true }
    ]
  }
}
```
