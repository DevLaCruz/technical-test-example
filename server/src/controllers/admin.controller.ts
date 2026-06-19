import { Request, Response } from 'express';
import Ticket from '../models/Ticket.js';
import Config from '../models/Config.js';
import User from '../models/User.js';

export const getStats = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find();
    const totalSold = tickets.length;
    // Calculate exact earnings using integer arithmetic (cents)
    const totalEarnings = tickets.reduce((sum, ticket) => sum + ticket.pricePaid, 0);

    res.json({ totalSold, totalEarnings });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      Ticket.find()
        .populate('user', 'firstName lastName dni email')
        .sort({ purchasedAt: -1 })
        .skip(skip)
        .limit(limit),
      Ticket.countDocuments()
    ]);

    res.json({
      sales,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales' });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { totalCapacity, basePrice, incrementPerTicket } = req.body;
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
    }
    
    if (totalCapacity !== undefined) config.totalCapacity = totalCapacity;
    if (basePrice !== undefined) config.basePrice = basePrice;
    if (incrementPerTicket !== undefined) config.incrementPerTicket = incrementPerTicket;

    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error updating config' });
  }
};

export const getConfig = async (req: Request, res: Response) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching config' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.json({ users: [], total: 0, page, totalPages: 0 });
    }

    // Escape regex characters
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safeQuery, 'i');

    const searchCriteria = {
      $or: [
        { dni: regex },
        { firstName: regex },
        { lastName: regex }
      ]
    };

    const [users, total] = await Promise.all([
      User.find(searchCriteria).select('-passwordHash').skip(skip).limit(limit),
      User.countDocuments(searchCriteria)
    ]);

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Error searching users' });
  }
};
