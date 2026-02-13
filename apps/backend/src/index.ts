import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    phase: 2,
    message: 'Phase 2 Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Helper function for email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Auth endpoints
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // TODO: Implement actual user registration with database
  res.status(201).json({
    message: 'User registered successfully (mock)',
    user: { id: 1, email },
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // TODO: Implement actual authentication with database and JWT
  res.json({
    message: 'Login successful (mock)',
    token: 'mock-jwt-token',
    user: { id: 1, email },
  });
});

// Project endpoints
app.get('/api/projects', (req: Request, res: Response) => {
  // TODO: Implement actual project retrieval from database
  res.json({
    projects: [],
    message: 'Projects endpoint ready for Phase 2',
  });
});

app.post('/api/projects', (req: Request, res: Response) => {
  const { name, description } = req.body;
  
  // TODO: Implement actual project creation with database
  res.status(201).json({
    message: 'Project created successfully (mock)',
    project: { id: 1, name, description, createdAt: new Date() },
  });
});

// Simulation endpoints
app.post('/api/simulations', (req: Request, res: Response) => {
  const { projectId, drawingData } = req.body;
  
  // TODO: Implement actual simulation with worker queue
  res.status(201).json({
    message: 'Simulation queued successfully (mock)',
    simulationId: 1,
    status: 'queued',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Phase 2 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
