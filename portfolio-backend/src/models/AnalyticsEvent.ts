import mongoose, { Schema, Document } from 'mongoose';

export type EventType = 'pageview' | 'click';

export interface IAnalyticsEvent extends Document {
  type: EventType;
  path: string;      // section id for pageviews, e.g. "projects"
  label: string;      // what was clicked, e.g. "project-code:Ledgerline"
  sessionId: string;  // random id generated client-side, stored in localStorage
  ip: string;
  country: string;
  region: string;
  city: string;
  org: string;         // ISP/company name from IP geolocation — best effort only
  userAgent: string;
  referrer: string;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  type: { type: String, enum: ['pageview', 'click'], required: true },
  path: { type: String, default: '' },
  label: { type: String, default: '' },
  sessionId: { type: String, default: '' },
  ip: { type: String, default: '' },
  country: { type: String, default: '' },
  region: { type: String, default: '' },
  city: { type: String, default: '' },
  org: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  referrer: { type: String, default: '' }
}, { timestamps: { createdAt: true, updatedAt: false } });

AnalyticsEventSchema.index({ createdAt: -1 });
AnalyticsEventSchema.index({ type: 1, path: 1 });
AnalyticsEventSchema.index({ type: 1, label: 1 });
AnalyticsEventSchema.index({ sessionId: 1 });

export default mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
