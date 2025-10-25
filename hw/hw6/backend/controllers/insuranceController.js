import Insurance from '../models/Insurance.js';
import logger from '../config/logging.js';

/**
 * Controller to handle form submission of insurance details.
 * @param {*} req - request object containing form data
 * @param {*} res - response object to send back status
 */
export const submitInsuranceDetails = async (req, res) => {
  try {
    const { userId, insuranceCarrier, policyNumber } = req.body;
    const insuranceData = new Insurance({ userId, insuranceCarrier, policyNumber });
    await insuranceData.save();
    res.status(201).json({ message: 'Insurance details submitted successfully!', insuranceData });
  } catch (error) {
    logger.error("Error submitting insurance details:", error);
    res.status(500).json({ error: error.message });
  }
};