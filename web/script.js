// ============================================
// JavaScript for Code Generation System
// ============================================

// Example specifications
const examples = {
    task: `# Task Management Application

## Overview
A comprehensive task management system for teams to organize work and collaborate on projects.

## Functional Requirements
- User authentication with JWT
- Create, read, update, and delete tasks
- Assign tasks to team members
- Set task priorities and deadlines
- Track task status (todo, in-progress, done)
- Add comments and attachments
- Create projects to organize tasks
- Generate reports and analytics

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
  status: enum[todo, in-progress, done]
  priority: enum[low, medium, high]
  assigned_to: uuid
  due_date: date
}

Model Project {
  id: uuid
  name: string
  owner_id: uuid
  created_at: date
}

## API Endpoints
POST /api/auth/login
POST /api/auth/register
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
GET /api/projects
POST /api/projects

## Authentication
JWT token-based authentication

## Database
PostgreSQL with Redis caching`,

    ecommerce: `# E-Commerce Platform

## Overview
Full-featured e-commerce platform with product catalog, shopping cart, orders, and payments.

## Functional Requirements
- Product browsing with search and filtering
- Shopping cart functionality
- User accounts with order history
- Payment processing
- Admin dashboard for inventory
- Customer reviews and ratings
- Wishlist feature
- Email notifications

## Data Models
Model Product {
  id: uuid
  name: string
  description: string
  price: number
  inventory: number
  category: string
}

Model Order {
  id: uuid
  user_id: uuid
  total: number
  status: enum[pending, confirmed, shipped, delivered]
  created_at: date
}

Model Cart {
  id: uuid
  user_id: uuid
  items: array
  created_at: date
}

## API Endpoints
GET /api/products
GET /api/products/:id
POST /api/cart
GET /api/cart
POST /api/orders
GET /api/orders/:id

## Authentication
User authentication with email and password

## Database
PostgreSQL with Redis for cart data`,

    analytics: `# Analytics Dashboard

## Overview
Real-time analytics platform with data visualization, reports, and metrics tracking.

## Functional Requirements
- Real-time data visualization
- Custom reports generation
- Metrics tracking and KPIs
- Data export to PDF and CSV
- User insights and analytics
- Performance monitoring
- Alert notifications

## Data Models
Model User {
  id: uuid
  email: email
  name: string
  created_at: date
}

Model Metric {
  id: uuid
  name: string
  value: number
  timestamp: date
  category: string
}

Model Report {
  id: uuid
  title: string
  data: object
  created_at: date
}

## API Endpoints
GET /api/metrics
POST /api/metrics
GET /api/reports
POST /api/reports
GET /api/dashboard

## Authentication
JWT authentication

## Database
PostgreSQL with Redis caching`
};

// Specification template
const template = `# My Application

## Overview
Brief description of what your app does.

## Functional Requirements
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description
- User authentication with JWT
- Data management and storage

## Data Models
Model User {
  id: uuid
  email: email
  password: string
  name: string
  created_at: date
}

Model [Entity] {
  id: uuid
  title: string
  description: string
  user_id: uuid
  status: enum[status1, status2, status3]
  created_at: date
}

## API Endpoints
GET /api/[entities]
POST /api/[entities]
GET /api/[entities]/:id
PUT /api/[entities]/:id
DELETE /api/[entities]/:id

## Authentication
JWT token-based authentication

## Database
PostgreSQL with Redis caching for performance

## Deployment
Docker containers with Docker Compose for development
Kubernetes support for production`;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupNavigation();
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // Load template button
    const loadTemplateBtn = document.getElementById('loadTemplate');
    if (loadTemplateBtn) {
        loadTemplateBtn.addEventListener('click', () => {
            document.getElementById('specification').value = template;
            document.querySelectorAll('.tab-btn')[0].click();
        });
    }

    // Load examples
    document.querySelectorAll('[data-example]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const exampleKey = e.target.dataset.example;
            document.getElementById('specification').value = examples[exampleKey];
            document.getElementById('appName').value = 
                exampleKey === 'task' ? 'Task Manager' :
                exampleKey === 'ecommerce' ? 'E-Commerce Store' :
                'Analytics Dashboard';
            document.querySelectorAll('.tab-btn')[0].click();
        });
    });

    // Form submission
    document.getElementById('generatorForm').addEventListener('submit', handleGenerate);

    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.querySelector('.modal-close')?.addEventListener('click', closeModal);

    // Download button
    document.getElementById('downloadBtn').addEventListener('click', downloadProject);

    // Modal background click
    document.getElementById('resultModal').addEventListener('click', (e) => {
        if (e.target.id === 'resultModal') {
            closeModal();
        }
    });
}

function setupNavigation() {
    // Update active nav link on scroll
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        navLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const section = document.getElementById(targetId);
            
            if (section) {
                const sectionTop = section.offsetTop - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Smooth scroll on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const section = document.getElementById(targetId);
            section?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ============================================
// TAB SWITCHING
// ============================================

function handleTabSwitch(e) {
    const button = e.target;
    const tabName = button.dataset.tab;
    const parentPanel = button.closest('.panel-header').parentElement;

    // Update active button
    parentPanel.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');

    // Update active content
    parentPanel.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    parentPanel.querySelector(`#${tabName}-tab`).classList.add('active');
}

// ============================================
// FORM HANDLING
// ============================================

function handleGenerate(e) {
    e.preventDefault();

    const formData = {
        appName: document.getElementById('appName').value,
        specification: document.getElementById('specification').value,
        framework: document.getElementById('framework').value,
        backend: document.getElementById('backend').value,
        database: document.getElementById('database').value,
        deployment: document.getElementById('deployment').value,
        includeTests: document.querySelector('input[name="includeTests"]').checked,
        includeDocs: document.querySelector('input[name="includeDocs"]').checked,
        includeCI: document.querySelector('input[name="includeCI"]').checked
    };

    // Validate
    if (!formData.specification.trim()) {
        alert('Please enter a specification');
        return;
    }

    // Show loading state
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const btnSpinner = generateBtn.querySelector('.btn-spinner');
    
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline';

    // Simulate generation (in real app, this would call backend API)
    setTimeout(() => {
        showResults(formData);
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
    }, 2000);
}

// ============================================
// RESULTS DISPLAY
// ============================================

function showResults(data) {
    const resultDetails = `
        <div>
            <strong>Project Name:</strong> ${escapeHtml(data.appName)}<br>
            <strong>Frontend:</strong> ${data.framework}<br>
            <strong>Backend:</strong> ${data.backend}<br>
            <strong>Database:</strong> ${data.database}<br>
            <strong>Deployment:</strong> ${data.deployment}<br>
            <strong>Includes:</strong> 
            ${data.includeTests ? '✓ Tests, ' : ''}
            ${data.includeDocs ? '✓ Documentation, ' : ''}
            ${data.includeCI ? '✓ CI/CD' : ''}
        </div>
    `;

    document.getElementById('resultDetails').innerHTML = resultDetails;

    // Generate file tree
    const fileTree = generateFileTree(data);
    document.getElementById('fileTree').innerHTML = fileTree;

    // Show modal
    showModal();

    // Update output preview
    updateOutputPreview(data);
}

function generateFileTree(data) {
    const appName = data.appName.replace(/\s+/g, '-').toLowerCase();
    
    const structure = [
        `${appName}/`,
        `├── frontend/`,
        `│   ├── src/`,
        `│   │   ├── components/`,
        `│   │   ├── pages/`,
        `│   │   ├── services/`,
        `│   │   ├── store/`,
        `│   │   ├── App.tsx`,
        `│   │   └── index.tsx`,
        `│   ├── package.json`,
        `│   └── tsconfig.json`,
        `├── backend/`,
        `│   ├── src/`,
        `│   │   ├── controllers/`,
        `│   │   ├── routes/`,
        `│   │   ├── middleware/`,
        `│   │   └── index.ts`,
        `│   ├── package.json`,
        `│   └── tsconfig.json`,
        `├── database/`,
        `│   ├── migrations/`,
        `│   └── scripts/`,
        `├── deployment/`,
        `│   ├── Dockerfile.backend`,
        `│   ├── Dockerfile.frontend`,
        `│   ├── docker-compose.yml`,
        `│   └── k8s/`,
        `├── package.json`,
        `├── README.md`,
        `└── .env.example`
    ];

    return '<pre>' + structure.map(line => escapeHtml(line)).join('\n') + '</pre>';
}

function updateOutputPreview(data) {
    const appName = data.appName.replace(/\s+/g, '-').toLowerCase();
    const preview = `
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            <h4 style="margin-top: 0;">📦 Application Generated Successfully!</h4>
            <p><strong>Project:</strong> ${escapeHtml(data.appName)}</p>
            <p><strong>Stack:</strong> ${data.framework} + ${data.backend}</p>
            <p><strong>Database:</strong> ${data.database}</p>
            <p style="margin-bottom: 0;"><strong>Ready to:</strong></p>
            <ul style="margin-top: 10px;">
                <li>Run locally with Docker Compose</li>
                <li>Deploy to production</li>
                <li>Extend with custom features</li>
            </ul>
        </div>
    `;
    
    document.getElementById('outputContent').innerHTML = preview;
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showModal() {
    const modal = document.getElementById('resultModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
    const modal = document.getElementById('resultModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// ============================================
// DOWNLOAD FUNCTION
// ============================================

function downloadProject() {
    const appName = document.getElementById('appName').value;
    const fileName = `${appName.replace(/\s+/g, '_')}_project.zip`;
    
    // In a real application, this would trigger a download from the server
    alert(`Project "${appName}" is ready to download!\n\nIn production, this would download: ${fileName}`);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================
// SMOOTH SCROLL HELPER
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
