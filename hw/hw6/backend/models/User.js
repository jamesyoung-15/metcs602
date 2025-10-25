import mongoose from 'mongoose';

/**
 * User Schema
 * Data collected during View #2 (intake)
 */
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  tos_agreed: { type: Boolean, required: true, default: false }
});


export default mongoose.model('User', userSchema);