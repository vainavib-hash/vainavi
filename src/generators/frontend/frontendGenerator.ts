/**
 * Frontend Code Generator
 * Generates React frontend code
 */

import { GenerationContext, GeneratedFile } from '../../types';

export class FrontendGenerator {
  async generate(context: GenerationContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Root files
    files.push(this.generatePackageJson());
    files.push(this.generateTsConfig());
    files.push(this.generateEnvExample());

    // Source structure
    files.push(...this.generateSourceFiles(context));
    files.push(...this.generateComponents(context));
    files.push(...this.generatePages(context));
    files.push(...this.generateServices(context));
    files.push(...this.generateStoreFiles(context));
    files.push(...this.generateUtilities());
    files.push(...this.generateStyles());

    return files;
  }

  private generateSourceFiles(context: GenerationContext): GeneratedFile[] {
    return [
      {
        path: 'frontend/index.tsx',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
`,
        fileType: 'code'
      },
      {
        path: 'frontend/App.tsx',
        content: `import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuth } from './store/authSlice';
import './App.css';

${this.generateAppImports(context)}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            ${this.generateAppRoutes(context)}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
`,
        fileType: 'code'
      },
      {
        path: 'frontend/index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${context.config.projectName}</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
</body>
</html>
`,
        fileType: 'code'
      }
    ];
  }

  private generateComponents(context: GenerationContext): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    files.push({
      path: 'frontend/src/components/Layout.tsx',
      content: `import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
`,
      fileType: 'code'
    });

    files.push({
      path: 'frontend/src/components/Navigation.tsx',
      content: `import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import './Navigation.css';

export default function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/dashboard">${context.config.projectName}</Link>
      </div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
`,
      fileType: 'code'
    });

    files.push({
      path: 'frontend/src/components/ProtectedRoute.tsx',
      content: `import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

export default function ProtectedRoute({ isAuthenticated }: ProtectedRouteProps) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
`,
      fileType: 'code'
    });

    files.push({
      path: 'frontend/src/components/FormInput.tsx',
      content: `import React from 'react';
import './FormInput.css';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false
}: FormInputProps) {
  return (
    <div className="form-group">
      <label>{label} {required && '*'}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
`,
      fileType: 'code'
    });

    files.push({
      path: 'frontend/src/components/Button.tsx',
      content: `import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className=\`btn btn-\${variant}\`
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
`,
      fileType: 'code'
    });

    return files;
  }

  private generatePages(context: GenerationContext): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // Login page
    files.push({
      path: 'frontend/src/pages/LoginPage.tsx',
      content: `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import authService from '../services/authService';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      dispatch(login({ token: response.token, user: response.user }));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Login</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />
          <Button type="submit" loading={loading}>
            Login
          </Button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}
`,
      fileType: 'code'
    });

    // Register page
    files.push({
      path: 'frontend/src/pages/RegisterPage.tsx',
      content: `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import authService from '../services/authService';
import './AuthPages.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.register(name, email, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Register</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            value={name}
            onChange={setName}
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />
          <FormInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />
          <Button type="submit" loading={loading}>
            Register
          </Button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}
`,
      fileType: 'code'
    });

    // Dashboard page
    files.push({
      path: 'frontend/src/pages/Dashboard.tsx',
      content: `import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}!</h1>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Application Overview</h2>
          <p>This is your auto-generated application dashboard.</p>
        </div>

        <div className="dashboard-card">
          <h2>Getting Started</h2>
          <ul>
            <li>Check the API documentation</li>
            <li>Explore the data models</li>
            <li>Configure your settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
`,
      fileType: 'code'
    });

    return files;
  }

  private generateServices(context: GenerationContext): GeneratedFile[] {
    return [
      {
        path: 'frontend/src/services/authService.ts',
        content: `import apiClient from './apiClient';

interface LoginResponse {
  token: string;
  user: { id: string; email: string; name: string };
}

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

export default authService;
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/services/apiClient.ts',
        content: `import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
`,
        fileType: 'code'
      }
    ];
  }

  private generateStoreFiles(context: GenerationContext): GeneratedFile[] {
    return [
      {
        path: 'frontend/src/store/index.ts',
        content: `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/store/authSlice.ts',
        content: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (!localStorage.getItem('token')) {
        return null;
      }
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue('Auth check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
`,
        fileType: 'code'
      }
    ];
  }

  private generateUtilities(): GeneratedFile[] {
    return [];
  }

  private generateStyles(): GeneratedFile[] {
    return [
      {
        path: 'frontend/src/index.css',
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  color: #333;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/App.css',
        content: `.app {
  width: 100%;
  height: 100vh;
}
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/components/Layout.css',
        content: `.layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/components/Navigation.css',
        content: `.navigation {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
}

.nav-links a:hover {
  opacity: 0.8;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c0392b;
}
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/components/Button.css',
        content: `.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #7f8c8d;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c0392b;
}
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/components/FormInput.css',
        content: `.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.input-error {
  border-color: #e74c3c !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/pages/AuthPages.css',
        content: `.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.auth-form h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.auth-form form {
  margin-bottom: 1.5rem;
}

.auth-form p {
  text-align: center;
  color: #666;
}

.auth-form a {
  color: #3498db;
  text-decoration: none;
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.alert-error {
  background-color: #fadbd8;
  color: #c0392b;
  border: 1px solid #e74c3c;
}
`,
        fileType: 'code'
      },
      {
        path: 'frontend/src/pages/Dashboard.css',
        content: `.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #2c3e50;
  font-size: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
}

.dashboard-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.dashboard-card h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.dashboard-card ul {
  list-style-position: inside;
  color: #666;
}

.dashboard-card li {
  margin-bottom: 0.5rem;
}
`,
        fileType: 'code'
      }
    ];
  }

  private generatePackageJson(): GeneratedFile[] {
    return [{
      path: 'frontend/package.json',
      content: JSON.stringify({
        name: 'frontend',
        version: '1.0.0',
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test',
          eject: 'react-scripts eject'
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          'react-router-dom': '^6.18.0',
          '@reduxjs/toolkit': '^1.9.7',
          'react-redux': '^8.1.3',
          axios: '^1.6.0',
          typescript: '^5.3.3'
        },
        devDependencies: {
          '@types/react': '^18.2.37',
          '@types/react-dom': '^18.2.15',
          'react-scripts': '^5.0.1'
        },
        eslintConfig: { extends: ['react-app'] },
        browserslist: { production: ['> 0.2%'], development: ['last 1 chrome version'] }
      }, null, 2),
      fileType: 'config'
    }];
  }

  private generateTsConfig(): GeneratedFile[] {
    return [{
      path: 'frontend/tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          jsx: 'react-jsx',
          module: 'ES2020',
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          outDir: './build',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        },
        include: ['src'],
        exclude: ['node_modules']
      }, null, 2),
      fileType: 'config'
    }];
  }

  private generateEnvExample(): GeneratedFile[] {
    return [{
      path: 'frontend/.env.example',
      content: `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
`,
      fileType: 'config'
    }];
  }

  private generateAppImports(context: GenerationContext): string {
    const pages = context.analysis.entities
      .filter(e => !e.isUser)
      .map(e => `import ${e.name}ListPage from './pages/${e.name}ListPage';`);

    return `import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
${pages.join('\n')}`;
  }

  private generateAppRoutes(context: GenerationContext): string {
    return context.analysis.entities
      .filter(e => !e.isUser)
      .map(e => `<Route path="/${e.name.toLowerCase()}s" element={<${e.name}ListPage />} />`)
      .join('\n            ');
  }
}
