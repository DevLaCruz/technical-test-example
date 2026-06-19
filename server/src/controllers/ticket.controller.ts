import { Request, Response } from 'express';
import Ticket from '../models/Ticket.js';
import Config from '../models/Config.js';
import { v4 as uuidv4 } from 'uuid';

export const buyTicket = async (req: Request, res: Response) => {
  try {
    const config = await Config.findOne();
    if (!config) {
      return res.status(500).json({ error: 'System configuration missing' });
    }

    const soldTickets = await Ticket.countDocuments();
    if (soldTickets >= config.totalCapacity) {
      return res.status(400).json({ error: 'No tickets available' });
    }

    const currentPrice = config.basePrice + (soldTickets * config.incrementPerTicket);

    // In a real app, we would process payment here and use a transaction

    const ticket = new Ticket({
      code: uuidv4(),
      user: req.user!._id,
      pricePaid: currentPrice
    });

    await ticket.save();

    res.status(201).json({ message: 'Ticket purchased successfully', ticket });
  } catch (error) {
    console.error('Buy ticket error:', error);
    res.status(500).json({ error: 'Error purchasing ticket' });
  }
};

export const getMyTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find({ user: req.user!._id }).sort({ purchasedAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tickets' });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'firstName lastName dni');
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Verify ownership
    if (ticket.user._id.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: You do not own this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ticket' });
  }
};
