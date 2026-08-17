import express, { Request, Response } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary';
import requireAuth from '../middleware/auth';

const router = express.Router();

// Keep the file in memory only long enough to stream it to Cloudinary —
// nothing is ever written to disk on the server itself.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// POST /api/upload - admin only. Multipart form field name must be "file".
router.post('/', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided (expected form field "file")' });
  }

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'auto' // handles PDFs, images, etc.
        },
        (error, uploadResult) => {
          if (error || !uploadResult) return reject(error || new Error('Upload failed'));
          resolve(uploadResult);
        }
      );
      Readable.from(req.file!.buffer).pipe(stream);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message || 'Upload failed' });
  }
});

export default router;
