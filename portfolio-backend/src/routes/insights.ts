import express, { Request, Response } from 'express';
import AnalyticsEvent from '../models/AnalyticsEvent';
import requireAuth from '../middleware/auth';

const router = express.Router();
router.use(requireAuth);

// GET /api/insights/summary
router.get('/summary', async (_req: Request, res: Response) => {
  const totalPageViews = await AnalyticsEvent.countDocuments({ type: 'pageview' });
  const totalClicks = await AnalyticsEvent.countDocuments({ type: 'click' });
  const uniqueSessions = await AnalyticsEvent.distinct('sessionId', { sessionId: { $ne: '' } });

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
router.get('/locations', async (_req: Request, res: Response) => {
  const results = await AnalyticsEvent.aggregate([
    { $match: { type: 'pageview', country: { $ne: '' } } },
    { $group: { _id: { country: '$country', city: '$city' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 50 }
  ]);
  res.json(results.map(r => ({ country: r._id.country, city: r._id.city, count: r.count })));
});

// GET /api/insights/pages - which section gets the most attention
router.get('/pages', async (_req: Request, res: Response) => {
  const results = await AnalyticsEvent.aggregate([
    { $match: { type: 'pageview', path: { $ne: '' } } },
    { $group: { _id: '$path', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(results.map(r => ({ path: r._id, count: r.count })));
});

// GET /api/insights/clicks - most-clicked links/buttons (résumé, project links, etc.)
router.get('/clicks', async (_req: Request, res: Response) => {
  const results = await AnalyticsEvent.aggregate([
    { $match: { type: 'click', label: { $ne: '' } } },
    { $group: { _id: '$label', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(results.map(r => ({ label: r._id, count: r.count })));
});

// GET /api/insights/companies - distinct visitor organizations, A → Z.
// Best-effort: derived from IP geolocation "org" field, so this reflects
// ISPs for home connections and often the real company for corporate/VPN
// traffic. Not a substitute for a paid reverse-IP identification service.
router.get('/companies', async (_req: Request, res: Response) => {
  const results = await AnalyticsEvent.aggregate([
    { $match: { type: 'pageview', org: { $ne: '' } } },
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

export default router;
