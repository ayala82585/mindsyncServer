import { Router } from 'express';
import { createSessionCtrl, joinSessionCtrl } from '../controllers/sessionController';

export const sessionsRouter = Router();

sessionsRouter.post('/', createSessionCtrl);
sessionsRouter.post('/:id/join', joinSessionCtrl);