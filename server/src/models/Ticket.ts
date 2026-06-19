import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User.js';

export interface ITicket extends Document {
  code: string;
  user: mongoose.Types.ObjectId | IUser;
  pricePaid: number; // Stored in cents
  purchasedAt: Date;
}

const TicketSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pricePaid: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITicket>('Ticket', TicketSchema);
