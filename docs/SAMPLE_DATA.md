# Sample Database Seed Data

This file contains comprehensive seed data for generated applications.

## Task Management System - Seed Data

### Users Table
```sql
INSERT INTO users (id, email, name, password_hash, role, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'John Smith', '$2b$10$...', 'admin', '2024-01-10 10:00:00'),
('550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', 'Sarah Johnson', '$2b$10$...', 'manager', '2024-01-12 14:30:00'),
('550e8400-e29b-41d4-a716-446655440003', 'mike@example.com', 'Mike Williams', '$2b$10$...', 'user', '2024-01-15 09:15:00'),
('550e8400-e29b-41d4-a716-446655440004', 'lisa@example.com', 'Lisa Brown', '$2b$10$...', 'user', '2024-02-01 11:45:00'),
('550e8400-e29b-41d4-a716-446655440005', 'david@example.com', 'David Michael', '$2b$10$...', 'user', '2024-02-05 16:20:00');
```

### Projects Table
```sql
INSERT INTO projects (id, name, description, owner_id, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Redesign company website with new branding', '550e8400-e29b-41d4-a716-446655440001', '2024-01-18 08:00:00', '2024-02-15 14:30:00'),
('660e8400-e29b-41d4-a716-446655440002', 'Mobile App Launch', 'Develop and launch iOS and Android apps', '550e8400-e29b-41d4-a716-446655440002', '2024-01-25 10:30:00', '2024-02-20 09:45:00'),
('660e8400-e29b-41d4-a716-446655440003', 'Q1 Product Features', 'Implement Q1 roadmap features', '550e8400-e29b-41d4-a716-446655440001', '2024-02-01 13:15:00', '2024-02-18 16:00:00'),
('660e8400-e29b-41d4-a716-446655440004', 'API Infrastructure', 'Build microservices architecture', '550e8400-e29b-41d4-a716-446655440002', '2024-02-10 11:00:00', '2024-02-25 15:30:00');
```

### Tasks Table
```sql
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, due_date, created_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Design new homepage', 'Create modern homepage design with new branding', 'in-progress', 'high', '550e8400-e29b-41d4-a716-446655440003', '2024-02-28', '2024-01-18 09:00:00'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Setup hosting', 'Configure hosting and domain', 'todo', 'high', '550e8400-e29b-41d4-a716-446655440004', '2024-03-05', '2024-01-19 10:30:00'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'iOS app development', 'Build iOS version of mobile app', 'in-progress', 'high', '550e8400-e29b-41d4-a716-446655440005', '2024-03-15', '2024-01-25 11:00:00'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Android app development', 'Build Android version of mobile app', 'todo', 'high', '550e8400-e29b-41d4-a716-446655440003', '2024-03-15', '2024-01-25 11:05:00'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'User authentication', 'Implement JWT authentication', 'done', 'high', '550e8400-e29b-41d4-a716-446655440004', '2024-02-20', '2024-02-01 14:00:00'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'User profiles', 'Create user profile pages', 'in-progress', 'medium', '550e8400-e29b-41d4-a716-446655440005', '2024-02-25', '2024-02-02 09:30:00'),
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', 'API Gateway setup', 'Configure API gateway', 'done', 'high', '550e8400-e29b-41d4-a716-446655440002', '2024-02-15', '2024-02-10 10:00:00'),
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', 'Service discovery', 'Implement service discovery', 'todo', 'medium', '550e8400-e29b-41d4-a716-446655440003', '2024-03-01', '2024-02-11 14:30:00');
```

### Comments Table
```sql
INSERT INTO comments (id, task_id, user_id, content, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Great design! Let''s implement this.', '2024-02-01 10:15:00'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'I''ll start the CSS styling tomorrow.', '2024-02-01 11:30:00'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'iOS development progressing well, 60% complete.', '2024-02-18 09:00:00');
```

---

## E-Commerce Platform - Seed Data

### Products Table
```sql
INSERT INTO products (id, name, description, price, inventory, category, image_url, created_at) VALUES
('900e8400-e29b-41d4-a716-446655440001', 'Wireless Headphones', 'Premium noise-cancelling wireless headphones', 199.99, 45, 'electronics', '/images/headphones.jpg', '2024-01-01 08:00:00'),
('900e8400-e29b-41d4-a716-446655440002', 'Laptop Stand', 'Adjustable aluminum laptop stand', 49.99, 120, 'accessories', '/images/stand.jpg', '2024-01-05 10:30:00'),
('900e8400-e29b-41d4-a716-446655440003', 'USB-C Cable', 'High-speed USB-C charging cable (3 pack)', 19.99, 200, 'cables', '/images/cable.jpg', '2024-01-10 14:15:00'),
('900e8400-e29b-41d4-a716-446655440004', 'Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 129.99, 35, 'peripherals', '/images/keyboard.jpg', '2024-01-12 09:45:00'),
('900e8400-e29b-41d4-a716-446655440005', '4K Webcam', 'Ultra HD 4K webcam for streaming', 159.99, 50, 'electronics', '/images/webcam.jpg', '2024-01-15 11:20:00'),
('900e8400-e29b-41d4-a716-446655440006', 'Monitor Light Bar', 'Smart monitor light bar with auto-dimming', 79.99, 65, 'lighting', '/images/lightbar.jpg', '2024-01-18 13:00:00'),
('900e8400-e29b-41d4-a716-446655440007', 'Desk Pad', 'Large extended desk pad (90x40cm)', 39.99, 100, 'accessories', '/images/pad.jpg', '2024-01-20 15:30:00'),
('900e8400-e29b-41d4-a716-446655440008', 'Portable SSD', '1TB portable SSD with fast transfer speeds', 129.99, 30, 'storage', '/images/ssd.jpg', '2024-01-22 10:00:00');
```

### Orders Table
```sql
INSERT INTO orders (id, user_id, total, status, created_at, updated_at) VALUES
('a00e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 249.98, 'delivered', '2024-02-01 08:30:00', '2024-02-05 10:00:00'),
('a00e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 309.97, 'shipped', '2024-02-10 14:15:00', '2024-02-18 09:30:00'),
('a00e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 79.99, 'processing', '2024-02-20 11:45:00', '2024-02-20 15:20:00'),
('a00e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 449.96, 'delivered', '2024-02-05 10:00:00', '2024-02-12 14:30:00'),
('a00e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 159.99, 'processing', '2024-02-22 16:00:00', '2024-02-22 16:00:00');
```

### Order Items Table
```sql
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
('b00e8400-e29b-41d4-a716-446655440001', 'a00e8400-e29b-41d4-a716-446655440001', '900e8400-e29b-41d4-a716-446655440001', 1, 199.99),
('b00e8400-e29b-41d4-a716-446655440002', 'a00e8400-e29b-41d4-a716-446655440001', '900e8400-e29b-41d4-a716-446655440003', 1, 19.99),
('b00e8400-e29b-41d4-a716-446655440003', 'a00e8400-e29b-41d4-a716-446655440002', '900e8400-e29b-41d4-a716-446655440004', 1, 129.99),
('b00e8400-e29b-41d4-a716-446655440004', 'a00e8400-e29b-41d4-a716-446655440002', '900e8400-e29b-41d4-a716-446655440006', 1, 79.99),
('b00e8400-e29b-41d4-a716-446655440005', 'a00e8400-e29b-41d4-a716-446655440002', '900e8400-e29b-41d4-a716-446655440002', 1, 49.99);
```

### Reviews Table
```sql
INSERT INTO reviews (id, product_id, user_id, rating, title, comment, created_at) VALUES
('c00e8400-e29b-41d4-a716-446655440001', '900e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 5, 'Excellent sound quality!', 'Best headphones I''ve ever owned. Noise cancelling works perfectly.', '2024-02-08 10:30:00'),
('c00e8400-e29b-41d4-a716-446655440002', '900e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 4, 'Great but pricey', 'Sound quality is amazing but they are a bit expensive.', '2024-02-12 14:15:00'),
('c00e8400-e29b-41d4-a716-446655440003', '900e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 5, 'Perfect for typing', 'Mechanical switches are satisfying. Great RGB lighting.', '2024-02-15 09:00:00'),
('c00e8400-e29b-41d4-a716-446655440004', '900e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 5, 'Sturdy and adjustable', 'Very stable. Adjustments are smooth. Highly recommended.', '2024-02-18 11:30:00');
```

---

## Analytics Dashboard - Seed Data

### Metrics Table
```sql
INSERT INTO metrics (id, category, name, value, unit, timestamp) VALUES
('d00e8400-e29b-41d4-a716-446655440001', 'traffic', 'page_views', 15847, 'views', '2024-02-20 00:00:00'),
('d00e8400-e29b-41d4-a716-446655440002', 'traffic', 'unique_users', 3245, 'users', '2024-02-20 00:00:00'),
('d00e8400-e29b-41d4-a716-446655440003', 'traffic', 'bounce_rate', 32.5, 'percent', '2024-02-20 00:00:00'),
('d00e8400-e29b-41d4-a716-446655440004', 'conversion', 'conversions', 543, 'count', '2024-02-20 00:00:00'),
('d00e8400-e29b-41d4-a716-446655440005', 'conversion', 'conversion_rate', 16.7, 'percent', '2024-02-20 00:00:00'),
('d00e8400-e29b-41d4-a716-446655440006', 'performance', 'avg_load_time', 1.23, 'seconds', '2024-02-20 00:00:00'),
('d00e8400-e29b-41d4-a716-446655440007', 'performance', 'error_rate', 0.15, 'percent', '2024-02-20 00:00:00'),
('d00e8400-e29b-41d4-a716-446655440008', 'revenue', 'daily_revenue', 24580, 'usd', '2024-02-20 00:00:00');
```

### User Activity Table
```sql
INSERT INTO user_activity (id, user_id, activity_type, page, timestamp) VALUES
('e00e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'page_view', '/dashboard', '2024-02-20 08:15:30'),
('e00e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'click', '/products', '2024-02-20 08:16:45'),
('e00e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'page_view', '/reports', '2024-02-20 08:18:00'),
('e00e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'form_submit', '/settings', '2024-02-20 08:19:15'),
('e00e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'download', '/export', '2024-02-20 08:20:30');
```

---

## JSON Export Format

### Complete Task
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Design new homepage",
  "description": "Create modern homepage design with new branding",
  "status": "in-progress",
  "priority": "high",
  "assignedTo": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Mike Williams",
    "email": "mike@example.com"
  },
  "dueDate": "2024-02-28",
  "createdAt": "2024-01-18T09:00:00Z",
  "updatedAt": "2024-02-15T14:30:00Z",
  "comments": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      "author": "Sarah Johnson",
      "content": "Great design! Let's implement this.",
      "createdAt": "2024-02-01T10:15:00Z"
    }
  ]
}
```

### Complete Product
```json
{
  "id": "900e8400-e29b-41d4-a716-446655440001",
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling wireless headphones",
  "price": 199.99,
  "inventory": 45,
  "category": "electronics",
  "imageUrl": "/images/headphones.jpg",
  "rating": 4.5,
  "reviews": 124,
  "inStock": true,
  "createdAt": "2024-01-01T08:00:00Z",
  "updatedAt": "2024-02-20T10:00:00Z"
}
```

### Complete Order
```json
{
  "id": "a00e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "items": [
    {
      "productId": "900e8400-e29b-41d4-a716-446655440001",
      "name": "Wireless Headphones",
      "quantity": 1,
      "price": 199.99,
      "subtotal": 199.99
    }
  ],
  "subtotal": 199.99,
  "tax": 16.00,
  "shipping": 33.99,
  "total": 249.98,
  "status": "delivered",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "USA"
  },
  "createdAt": "2024-02-01T08:30:00Z",
  "deliveredAt": "2024-02-05T10:00:00Z"
}
```

---

## CSV Format

### Tasks CSV
```csv
id,project_id,title,status,priority,assigned_to_name,due_date,created_at
770e8400-e29b-41d4-a716-446655440001,660e8400-e29b-41d4-a716-446655440001,Design new homepage,in-progress,high,Mike Williams,2024-02-28,2024-01-18 09:00:00
770e8400-e29b-41d4-a716-446655440002,660e8400-e29b-41d4-a716-446655440001,Setup hosting,todo,high,Lisa Brown,2024-03-05,2024-01-19 10:30:00
770e8400-e29b-41d4-a716-446655440003,660e8400-e29b-41d4-a716-446655440002,iOS app development,in-progress,high,David Michael,2024-03-15,2024-01-25 11:00:00
```

### Products CSV
```csv
id,name,price,inventory,category,rating,reviews
900e8400-e29b-41d4-a716-446655440001,Wireless Headphones,199.99,45,electronics,4.5,124
900e8400-e29b-41d4-a716-446655440002,Laptop Stand,49.99,120,accessories,4.8,89
900e8400-e29b-41d4-a716-446655440003,USB-C Cable,19.99,200,cables,4.7,156
```

### Metrics CSV
```csv
date,page_views,unique_users,bounce_rate,conversions,revenue
2024-02-18,12543,2891,35.2,431,18923.50
2024-02-19,14201,3012,33.8,487,21550.75
2024-02-20,15847,3245,32.5,543,24580.00
```
