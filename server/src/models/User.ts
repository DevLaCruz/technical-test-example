import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  dni: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

const UserSchema: Schema = new Schema({
  dni: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
