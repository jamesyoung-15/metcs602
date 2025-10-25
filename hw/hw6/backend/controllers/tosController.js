import User from "../models/User.js";
import logger from "../config/logging.js";

/**
 * Controller to handle Terms of Service agreement submission.
 * @param {*} req - request object containing user ID and agreement status
 * @param {*} res - response object to send back status
 */
export const submitTosAgreement = async (req, res) => {
  try {
    const { userId, tosAgreed } = req.body;

    if (typeof tosAgreed !== 'boolean' || !userId) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Update the user's TOS agreement status
    await User.findByIdAndUpdate(
      userId,
      { tos_agreed: tosAgreed },
      { new: true }
    );
    
    res.status(200).json({ message: 'Terms of Service agreement updated successfully!' });
  } catch (error) {
    logger.error(`Error updating TOS agreement: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};