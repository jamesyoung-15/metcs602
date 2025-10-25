import mongoose from 'mongoose';

/**
 * Insurance Schema
 * Data collected during View #3 (insurance information)
 */
const insuranceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  insuranceCarrier: { type: String, required: true },
  policyNumber: { type: String, required: true },
  insuranceCardImagePath: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model('Insurance', insuranceSchema);