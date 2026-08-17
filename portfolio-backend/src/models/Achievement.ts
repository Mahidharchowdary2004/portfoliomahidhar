import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  description: string;
  icon: string;
  order: number;
}

const AchievementSchema = new Schema<IAchievement>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '★' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
