import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  tags: string[];
  codeUrl: string;
  liveUrl: string;
  icon: string;
  imageUrl: string;
  category: string;
  order: number;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  tags: { type: [String], default: [] },
  codeUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  icon: { type: String, default: '⌁' },
  imageUrl: { type: String, default: '' },
  category: { type: String, default: 'Personal' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
