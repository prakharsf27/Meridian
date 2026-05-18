import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckIn extends Document {
  goalSheetId: mongoose.Types.ObjectId;
  quarter: string;
  employeeComment: string;
  managerComment: string;
  capturedAt: Date;
  capturedBy: mongoose.Types.ObjectId;
}

const CheckInSchema: Schema = new Schema({
  goalSheetId: { type: Schema.Types.ObjectId, ref: 'GoalSheet', required: true },
  quarter: { type: String, required: true },
  employeeComment: { type: String, default: '' },
  managerComment: { type: String, default: '' },
  capturedAt: { type: Date, default: Date.now },
  capturedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<ICheckIn>('CheckIn', CheckInSchema);
