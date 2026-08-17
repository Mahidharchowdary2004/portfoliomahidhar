import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

const router = express.Router();

interface LoginBody {
  username?: string;
  password?: string;
}

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is missing on the server.');
      return res.status(500).json({
        error: 'Server configuration error: JWT_SECRET environment variable is missing. Please set it in Render dashboard environment settings.'
      });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error('Error during login:', err);
    next(err);
  }
});

export default router;
