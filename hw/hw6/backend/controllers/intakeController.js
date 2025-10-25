import User from '../models/User.js';
import logger from '../config/logging.js';

/**
 * Controller to handle form submission of user intake form.
 * @param {*} req - request object containing form data
 * @param {*} res - response object to send back status
 */
export const submitIntakeForm = async (req, res) => {
  try {
    const { firstName, middleName, lastName, mobile, email, address } = req.body;
    const user = new User({ firstName, middleName, lastName, mobile, email, address });
    await user.save();
    res.status(201).json({ message: 'User intake form submitted successfully!', user: user, userId: user._id.toString() });
  } catch (error) {
    logger.error(`Error submitting intake form: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};