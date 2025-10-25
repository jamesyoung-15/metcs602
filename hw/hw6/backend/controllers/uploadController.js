import Insurance from '../models/Insurance.js';
import logger from '../config/logging.js';

/** * Controller to handle insurance card file uploads.
 * @param {*} req - request object containing the uploaded file
 * @param {*} res - response object to send back status
 */
export const uploadInsuranceCard = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Update the insurance document with the path to the uploaded insurance card image
    await Insurance.findOneAndUpdate(
      { userId: req.body.userId },
      { insuranceCardImagePath: req.file.path },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'File uploaded successfully!', filePath: req.file.path });
  } catch (error) {
    logger.error("Error uploading insurance card:", error);
    res.status(500).json({ error: error.message });
  }
};