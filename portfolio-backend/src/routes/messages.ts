import express, { Request, Response } from 'express';
import requireAuth from '../middleware/auth';
import Message from '../models/Message';

const router = express.Router();

// GET /api/messages - Admin only: List all messages, newest first
router.get('/', requireAuth, async (_req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// DELETE /api/messages/:id - Admin only: Delete a message
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const item = await Message.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Message not found' });
    res.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
