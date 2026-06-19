import { Router } from 'express';
import { buyTicket, getMyTickets, getTicketById } from '../controllers/ticket.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.post('/buy', buyTicket);
router.get('/my-tickets', getMyTickets);
router.get('/:id', getTicketById);

export default router;
