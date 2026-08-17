import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillGroup extends Document {
  category: string;
  items: string[];
  order: number;
}

const SkillGroupSchema = new Schema<ISkillGroup>({
  category: { type: String, required: true },
  items: { type: [String], default: [] },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ISkillGroup>('SkillGroup', SkillGroupSchema);
