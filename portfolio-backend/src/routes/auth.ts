import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

const router = express.Router();

interface LoginBody {
  username?: string;
  password?: string;
}

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
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

  const token = jwt.sign(
    { id: admin._id.toString(), username: admin.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  res.json({ token, username: admin.username });
});

export default router;
