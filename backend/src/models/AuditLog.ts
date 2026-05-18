import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  action: string;
  before: any;
  after: any;
  changedBy: mongoose.Types.ObjectId;
  changedAt: Date;
}

const AuditLogSchema: Schema = new Schema({
  entityType: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  action: { type: String, required: true },
  before: { type: Schema.Types.Mixed },
  after: { type: Schema.Types.Mixed },
  changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  changedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
