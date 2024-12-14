<content>import Service from '../models/Service.js';
import { logger } from '../utils/logger.js';

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ userId: req.userId });
    res.json(services);
  } catch (error) {
    next(error);
  }
};

export const getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const service = new Service({
      ...req.body,
      userId: req.userId
    });

    await service.save();
    logger.info(`New service created: ${service._id}`);

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    logger.info(`Service updated: ${service._id}`);
    res.json(service);
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    logger.info(`Service deleted: ${req.params.id}`);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};</content>