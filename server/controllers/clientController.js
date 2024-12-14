<content>import Client from '../models/Client.js';
import { logger } from '../utils/logger.js';

export const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ userId: req.userId });
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

export const getClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req, res, next) => {
  try {
    const client = new Client({
      ...req.body,
      userId: req.userId
    });

    await client.save();
    logger.info(`New client created: ${client._id}`);

    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    logger.info(`Client updated: ${client._id}`);
    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    logger.info(`Client deleted: ${req.params.id}`);
    res.json({ message: 'Client deleted' });
  } catch (error) {
    next(error);
  }
};</content>