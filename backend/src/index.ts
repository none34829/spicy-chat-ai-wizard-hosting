import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import apiRouter from './routes/api.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://spicy-chat-ai-wizard-hosting.vercel.app/'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Parse JSON bodies
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', apiRouter); 

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to SpicyChat AI Wizard Hosting API' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;