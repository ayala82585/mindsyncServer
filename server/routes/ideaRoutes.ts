import { Router } from 'express';
import { createIdeaCtrl } from '../controllers/ideaController';

export const ideasRouter = Router();

ideasRouter.post('/', createIdeaCtrl);