import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  role: string;
  tagline: string;
  bioParagraphs: string[];
  location: string;
  experienceLabel: string;
  focus: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
  photoUrl: string;
  design: string;
}

// This is a single-document collection: there is only ever one Profile.
const ProfileSchema = new Schema<IProfile>({
  name: { type: String, default: 'Mahidhar' },
  role: { type: String, default: 'Software Engineer' },

  tagline: { type: String, default: '' },
  bioParagraphs: { type: [String], default: [] },
  location: { type: String, default: '' },
  experienceLabel: { type: String, default: '' },
  focus: { type: String, default: '' },
  availability: { type: String, default: 'Available for Internship, Full-Time, Remote, Hybrid, Relocation' },
  email: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  design: { type: String, default: 'lavender' }
}, { timestamps: true });

export default mongoose.model<IProfile>('Profile', ProfileSchema);
