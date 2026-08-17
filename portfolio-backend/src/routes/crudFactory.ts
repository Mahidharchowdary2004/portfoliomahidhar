import express, { Request, Response } from 'express';
import { Model, Document } from 'mongoose';
import requireAuth from '../middleware/auth';

// Builds a standard REST router for any Mongoose model: GET (public,
// sorted by "order"), POST/PUT/DELETE (admin only).
function crudRoutes<T extends Document>(Model: Model<T>) {
  const router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    const items = await Model.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  });

  router.post('/', requireAuth, async (req: Request, res: Response) => {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  });

  router.put('/:id', requireAuth, async (req: Request, res: Response) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  });

  router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
  });

  return router;
}

export default crudRoutes;
