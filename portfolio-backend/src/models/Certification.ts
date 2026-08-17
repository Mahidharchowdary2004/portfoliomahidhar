import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
  title: string;
  org: string;
  year: string;
  certificateUrl: string;
  icon: string;
  order: number;
}

const CertificationSchema = new Schema<ICertification>({
  title: { type: String, required: true },
  org: { type: String, default: '' },
  year: { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  icon: { type: String, default: '📜' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ICertification>('Certification', CertificationSchema);
