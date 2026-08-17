import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
  degree: string;
  institution: string;
  duration: string;
  detail: string;
  certificateUrl: string;
  icon: string;
  order: number;
  cgpaOrMarks?: string;
}

const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, default: '' },
  detail: { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  icon: { type: String, default: '🎓' },
  order: { type: Number, default: 0 },
  cgpaOrMarks: { type: String, default: '' }
}, { timestamps: true });


export default mongoose.model<IEducation>('Education', EducationSchema);
