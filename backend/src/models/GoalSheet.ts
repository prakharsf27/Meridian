import mongoose, { Schema, Document } from 'mongoose';

export interface IGoalSheet extends Document {
  employeeId: mongoose.Types.ObjectId;
  cycleId: mongoose.Types.ObjectId;
  status: 'draft' | 'submitted' | 'approved' | 'locked' | 'reopened';
  totalWeightage: number;
  submittedAt?: Date;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
}

const GoalSheetSchema: Schema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cycleId: { type: Schema.Types.ObjectId, ref: 'Cycle', required: true },
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'locked', 'reopened'], default: 'draft' },
  totalWeightage: { type: Number, default: 0 },
  submittedAt: { type: Date },
  approvedAt: { type: Date },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IGoalSheet>('GoalSheet', GoalSheetSchema);
