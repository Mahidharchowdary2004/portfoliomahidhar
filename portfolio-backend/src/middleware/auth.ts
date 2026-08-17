import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminTokenPayload } from '../types';

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AdminTokenPayload;
    req.admin = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export default requireAuth;
