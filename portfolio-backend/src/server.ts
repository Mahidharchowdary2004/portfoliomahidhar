import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import './types';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import educationRoutes from './routes/education';
import skillsRoutes from './routes/skills';
import projectsRoutes from './routes/projects';
import experienceRoutes from './routes/experience';
import certificationsRoutes from './routes/certifications';
import achievementsRoutes from './routes/achievements';
import uploadRoutes from './routes/upload';
import trackRoutes from './routes/track';
import insightsRoutes from './routes/insights';
import contactRoutes from './routes/contact';

const app = express();
app.set('trust proxy', true);

connectDB();

// --- CORS ---
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, server-to-server, same-origin admin panel)
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const err = new Error('Not allowed by CORS') as Error & { status?: number };
    err.status = 403;
    return callback(err);
  }
}));

app.use(express.json());

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

// --- Redirect root to /admin ---
app.get('/', (_req: Request, res: Response) => res.redirect('/admin'));

// --- Serve the admin panel as static files at /admin ---
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// --- Error handler (keeps error shape consistent as JSON) ---
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message !== 'Not allowed by CORS') {
    console.error(err);
  }
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
