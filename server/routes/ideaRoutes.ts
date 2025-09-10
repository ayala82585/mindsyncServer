import { Router } from 'express';
import { createIdeaCtrl, getIdeasBySession, reactToIdea  } from '../controllers/ideaController';
import { requireFirebaseAuth } from '../middleware/auth';
import { verifyUserInDb } from '../middleware/verifyUserInDb';

export const ideasRouter = Router();

ideasRouter.use(requireFirebaseAuth, verifyUserInDb);

ideasRouter.get("/:sessionId", getIdeasBySession);
ideasRouter.post('/create', createIdeaCtrl);
ideasRouter.post("/:ideaId/react", reactToIdea);
