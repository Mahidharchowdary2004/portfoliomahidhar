import express, { Request, Response } from 'express';
import AnalyticsEvent, { EventType } from '../models/AnalyticsEvent';
import { lookupGeo } from '../utils/geoLookup';

const router = express.Router();

interface TrackBody {
  type?: EventType;
  path?: string;
  label?: string;
  sessionId?: string;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '';
}

// POST /api/track - public, called by the portfolio page itself.
// Never blocks or errors out visibly — analytics should never break
// the visitor's experience.
router.post('/', async (req: Request<{}, {}, TrackBody>, res: Response) => {
  const { type, path, label, sessionId } = req.body;

  if (type !== 'pageview' && type !== 'click') {
    return res.status(204).end();
  }

  const ip = getClientIp(req);
  const geo = await lookupGeo(ip);

  try {
    await AnalyticsEvent.create({
      type,
      path: path || '',
      label: label || '',
      sessionId: sessionId || '',
      ip,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      org: geo.org,
      userAgent: req.headers['user-agent'] || '',
      referrer: req.headers['referer'] || ''
    });
  } catch {
    // swallow — analytics failures should never surface to the visitor
  }

  res.status(204).end();
});

export default router;
