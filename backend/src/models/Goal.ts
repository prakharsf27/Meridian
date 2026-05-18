import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  goalSheetId: mongoose.Types.ObjectId;
  thrustArea: string;
  title: string;
  description: string;
  uomType: 'numeric' | 'percent' | 'timeline' | 'zero';
  target: string;
  actual: string;
  weightage: number;
  status: 'not_started' | 'on_track' | 'completed';
  isShared: boolean;
  sharedFromGoalId?: mongoose.Types.ObjectId;
  locked: boolean;
}

const GoalSchema: Schema = new Schema({
  goalSheetId: { type: Schema.Types.ObjectId, ref: 'GoalSheet', required: true },
  thrustArea: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  uomType: { type: String, enum: ['numeric', 'percent', 'timeline', 'zero'], required: true },
  target: { type: String, required: true },
  actual: { type: String, default: '' },
  weightage: { type: Number, required: true },
  status: { type: String, enum: ['not_started', 'on_track', 'completed'], default: 'not_started' },
  isShared: { type: Boolean, default: false },
  sharedFromGoalId: { type: Schema.Types.ObjectId, ref: 'Goal' },
  locked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IGoal>('Goal', GoalSchema);
