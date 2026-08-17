import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true }
});

export default mongoose.model<IAdmin>('Admin', AdminSchema);
