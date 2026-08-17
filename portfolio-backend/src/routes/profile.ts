import express, { Request, Response } from 'express';
import Profile from '../models/Profile';
import requireAuth from '../middleware/auth';

const router = express.Router();

// GET /api/profile - public
router.get('/', async (_req: Request, res: Response) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({}); // creates one with schema defaults
  }
  res.json(profile);
});

// PUT /api/profile - admin only
router.put('/', requireAuth, async (req: Request, res: Response) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = new Profile();
  }
  Object.assign(profile, req.body);
  await profile.save();
  res.json(profile);
});

export default router;
