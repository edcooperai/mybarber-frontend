<content>import Appointment from '../models/Appointment.js';
import { logger } from '../utils/logger.js';

export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate('clientId', 'name phoneNumber')
      .populate('serviceId', 'name duration price');
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.userId
    })
      .populate('clientId', 'name phoneNumber')
      .populate('serviceId', 'name duration price');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      userId: req.userId
    });

    await appointment.save();
    logger.info(`New appointment created: ${appointment._id}`);

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    logger.info(`Appointment updated: ${appointment._id}`);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    logger.info(`Appointment deleted: ${req.params.id}`);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    next(error);
  }
};</content>