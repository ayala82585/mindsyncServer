import { Router } from 'express';
import { createIdeaCtrl,getIdeasBySession, reactToIdea } from '../controllers/ideaController';

export const ideasRouter = Router();


ideasRouter.get("/sessions/:sessionId/ideas", getIdeasBySession);
ideasRouter.post("/:ideaId/react", reactToIdea);
ideasRouter.post('/', createIdeaCtrl);