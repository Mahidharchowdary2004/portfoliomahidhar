import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<IMessage>('Message', MessageSchema);
