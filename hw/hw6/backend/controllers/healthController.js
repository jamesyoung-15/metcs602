import HealthQuestionnaire from '../models/HealthQuestionnaire.js';
import logger from '../config/logging.js';

/**
 * Controller to handle form submission of health questionnaire.
 * @param {*} req - request object containing form data
 * @param {*} res - response object to send back status
 */
export const submitHealthQuestions = async (req, res) => {
  try {
    const { userId, grayHairBeforeChildren, brokenBoneAfter16, tripsOverSmallStones } = req.body;
    const healthData = new HealthQuestionnaire({ userId, grayHairBeforeChildren, brokenBoneAfter16, tripsOverSmallStones });
    await healthData.save();
    res.status(201).json({ message: 'Health questionnaire submitted successfully!', healthData });
  } catch (error) {
    logger.error("Error submitting health questionnaire:", error);
    res.status(500).json({ error: error.message });
  }
};