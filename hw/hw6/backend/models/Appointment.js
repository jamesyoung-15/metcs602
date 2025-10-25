import mongoose from 'mongoose';

/**
 * Appointment Schema
 * Data collected for user appointments (View #5)
 */
const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);