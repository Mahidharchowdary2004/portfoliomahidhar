import express, { Request, Response } from 'express';
import AnalyticsEvent from '../models/AnalyticsEvent';
import requireAuth from '../middleware/auth';

const router = express.Router();
router.use(requireAuth);

// GET /api/insights/summary
router.get('/summary', async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const filter: Record<string, any> = {};
  if (start && end) {
    filter.createdAt = {
      $gte: new Date(start as string),
      $lte: new Date(end as string)
    };
  }

  const totalPageViews = await AnalyticsEvent.countDocuments({ type: 'pageview', ...filter });
  const totalClicks = await AnalyticsEvent.countDocuments({ type: 'click', ...filter });
  const uniqueSessions = await AnalyticsEvent.distinct('sessionId', { sessionId: { $ne: '' }, ...filter });

  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const activeSessions = await AnalyticsEvent.distinct('sessionId', {
    createdAt: { $gte: fiveMinAgo },
    sessionId: { $ne: '' }
  });

  res.json({
    totalPageViews,
    totalClicks,
    uniqueVisitors: uniqueSessions.length,
    activeNow: activeSessions.length
  });
});

// GET /api/insights/locations - visitor geography, most-visited first
router.get('/locations', async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const matchStage: Record<string, any> = { type: 'pageview', country: { $ne: '' } };
  if (start && end) {
    matchStage.createdAt = {
      $gte: new Date(start as string),
      $lte: new Date(end as string)
    };
  }

  const results = await AnalyticsEvent.aggregate([
    { $match: matchStage },
    { $group: { _id: { country: '$country', city: '$city' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 50 }
  ]);
  res.json(results.map(r => ({ country: r._id.country, city: r._id.city, count: r.count })));
});

// GET /api/insights/pages - which section gets the most attention
router.get('/pages', async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const matchStage: Record<string, any> = { type: 'pageview', path: { $ne: '' } };
  if (start && end) {
    matchStage.createdAt = {
      $gte: new Date(start as string),
      $lte: new Date(end as string)
    };
  }

  const results = await AnalyticsEvent.aggregate([
    { $match: matchStage },
    { $group: { _id: '$path', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(results.map(r => ({ path: r._id, count: r.count })));
});

// GET /api/insights/clicks - most-clicked links/buttons (résumé, project links, etc.)
router.get('/clicks', async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const matchStage: Record<string, any> = { type: 'click', label: { $ne: '' } };
  if (start && end) {
    matchStage.createdAt = {
      $gte: new Date(start as string),
      $lte: new Date(end as string)
    };
  }

  const results = await AnalyticsEvent.aggregate([
    { $match: matchStage },
    { $group: { _id: '$label', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(results.map(r => ({ label: r._id, count: r.count })));
});

// GET /api/insights/companies - distinct visitor organizations, A → Z.
// Best-effort: derived from IP geolocation "org" field, so this reflects
// ISPs for home connections and often the real company for corporate/VPN
// traffic. Not a substitute for a paid reverse-IP identification service.
router.get('/companies', async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const matchStage: Record<string, any> = { type: 'pageview', org: { $ne: '' } };
  if (start && end) {
    matchStage.createdAt = {
      $gte: new Date(start as string),
      $lte: new Date(end as string)
    };
  }

  const results = await AnalyticsEvent.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$org',
        count: { $sum: 1 },
        lastSeen: { $max: '$createdAt' },
        country: { $first: '$country' }
      }
    },
    { $sort: { _id: 1 } } // A → Z
  ]);
  res.json(results.map(r => ({ company: r._id, count: r.count, lastSeen: r.lastSeen, country: r.country })));
});

// GET /api/insights/company-details - detailed sessions and events for a specific organization/ISP
router.get('/company-details', async (req: Request, res: Response) => {
  const { org, start, end } = req.query;
  if (!org || typeof org !== 'string') {
    return res.status(400).json({ error: 'org query parameter is required' });
  }

  const filter: Record<string, any> = { org };
  if (start && end) {
    filter.createdAt = {
      $gte: new Date(start as string),
      $lte: new Date(end as string)
    };
  }

  // Get all events matching this org, sorted chronologically (oldest to newest)
  const events = await AnalyticsEvent.find(filter).sort({ createdAt: 1 });

  // Group events by sessionId
  const sessionsMap: Record<string, {
    sessionId: string;
    ip: string;
    city: string;
    region: string;
    country: string;
    userAgent: string;
    referrer: string;
    firstSeen: Date;
    lastSeen: Date;
    events: Array<{
      type: string;
      path: string;
      label: string;
      createdAt: Date;
    }>;
  }> = {};

  for (const event of events) {
    const sId = event.sessionId || `unknown-${event.ip}`;
    if (!sessionsMap[sId]) {
      sessionsMap[sId] = {
        sessionId: sId,
        ip: event.ip,
        city: event.city,
        region: event.region,
        country: event.country,
        userAgent: event.userAgent,
        referrer: event.referrer,
        firstSeen: event.createdAt,
        lastSeen: event.createdAt,
        events: []
      };
    }
    
    sessionsMap[sId].lastSeen = event.createdAt;
    sessionsMap[sId].events.push({
      type: event.type,
      path: event.path,
      label: event.label,
      createdAt: event.createdAt
    });
  }

  // Convert to array and sort sessions by lastSeen descending (newest sessions first)
  const sessions = Object.values(sessionsMap).sort(
    (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime()
  );

  res.json({ org, sessions });
});

// GET /api/insights/contact-submissions - list of contact form submit events
router.get('/contact-submissions', async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const filter: Record<string, any> = { type: 'click', label: 'contact-form-submit' };
  if (start && end) {
    filter.createdAt = {
      $gte: new Date(start as string),
      $lte: new Date(end as string)
    };
  }

  const submissions = await AnalyticsEvent.find(filter)
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(submissions.map(s => ({
    id: s._id,
    ip: s.ip,
    city: s.city,
    region: s.region,
    country: s.country,
    org: s.org || 'Unknown Provider',
    createdAt: s.createdAt
  })));
});

export default router;
