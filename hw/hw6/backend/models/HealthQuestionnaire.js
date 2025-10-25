import mongoose from 'mongoose';
/**
 * Health Questionnaire Schema
 * Data collected during View #3 (health questionnaire)
 */
const healthQuestionnaireSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grayHairBeforeChildren: { type: Boolean, required: true },
  brokenBoneAfter16: { type: Boolean, required: true },
  tripsOverSmallStones: { type: Boolean, required: true },
}, { timestamps: true });

export default mongoose.model('HealthQuestionnaire', healthQuestionnaireSchema);