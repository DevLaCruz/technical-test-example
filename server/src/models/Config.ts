import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
  totalCapacity: number;
  basePrice: number; // Stored in cents
  incrementPerTicket: number; // Stored in cents
}

const ConfigSchema: Schema = new Schema({
  totalCapacity: { type: Number, required: true, default: 100 },
  basePrice: { type: Number, required: true, default: 1000 }, // e.g., 10.00
  incrementPerTicket: { type: Number, required: true, default: 0 }, // e.g., 0.00
}, {
  timestamps: true
});

export default mongoose.model<IConfig>('Config', ConfigSchema);
