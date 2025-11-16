import { Router } from 'express';
import { createSessionCtrl, getAllSessionsCtrl, getSessionHandler, getSessionsByUserCtrl, joinSessionCtrl } from '../controllers/sessionController';
import { requireFirebaseAuth } from '../middleware/auth';
import { verifyUserInDb } from '../middleware/verifyUserInDb';

export const sessionsRouter = Router();

sessionsRouter.use(requireFirebaseAuth, verifyUserInDb);
sessionsRouter.post('/createSession', createSessionCtrl);
sessionsRouter.post('/:id/join', joinSessionCtrl);
sessionsRouter.post("/get/:identifier", getSessionHandler);
sessionsRouter.get("/getAllSessions", getAllSessionsCtrl);
sessionsRouter.get("/user", getSessionsByUserCtrl);