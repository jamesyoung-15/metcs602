import Appointment from '../models/Appointment.js';
import logger from '../config/logging.js';

/**
 * Controller to handle scheduling of appointments.
 * @param {*} req - request object containing appointment data
 * @param {*} res - response object to send back status
 */
export const scheduleAppointment = async (req, res) => {
  try {
    const { userId, appointmentDate, appointmentTime } = req.body;
    const appointment = new Appointment({ userId, appointmentDate, appointmentTime });
    await appointment.save();
    res.status(201).json({ message: 'Appointment scheduled successfully!', appointment });
  } catch (error) {
    logger.error("Error scheduling appointment:", error);
    res.status(500).json({ error: error.message });
  }
};