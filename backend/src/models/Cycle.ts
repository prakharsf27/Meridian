import mongoose, { Schema, Document } from 'mongoose';

export interface ICycle extends Document {
  name: string;
  openDate: Date;
  goalSubmissionStart: Date;
  q1Start: Date;
  q2Start: Date;
  q3Start: Date;
  q4Start: Date;
  isActive: boolean;
}

const CycleSchema: Schema = new Schema({
  name: { type: String, required: true },
  openDate: { type: Date, required: true },
  goalSubmissionStart: { type: Date, required: true },
  q1Start: { type: Date, required: true },
  q2Start: { type: Date, required: true },
  q3Start: { type: Date, required: true },
  q4Start: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ICycle>('Cycle', CycleSchema);
