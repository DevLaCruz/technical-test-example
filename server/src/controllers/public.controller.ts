import { Request, Response } from 'express';
import Config from '../models/Config.js';
import Ticket from '../models/Ticket.js';

export const getStatus = async (req: Request, res: Response) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
      await config.save();
    }

    const soldTickets = await Ticket.countDocuments();
    const currentPrice = config.basePrice + (soldTickets * config.incrementPerTicket);
    const availableTickets = Math.max(0, config.totalCapacity - soldTickets);

    res.json({
      currentPrice,
      availableTickets,
      totalCapacity: config.totalCapacity
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching status' });
  }
};
