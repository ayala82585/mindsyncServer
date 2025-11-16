import { Router } from 'express';
import { createIdeaCtrl, deleteIdeaCtrl, getIdeasBySessionCtrl, updateIdeaCtrl } from '../controllers/ideaController';
import { requireFirebaseAuth } from '../middleware/auth';
import { verifyUserInDb } from '../middleware/verifyUserInDb';

export const ideasRouter = Router();

ideasRouter.use(requireFirebaseAuth, verifyUserInDb);

//ideasRouter.get("/:sessionId", getIdeasBySession);
ideasRouter.post('/create', createIdeaCtrl);
ideasRouter.put("/update/:id", updateIdeaCtrl);
ideasRouter.delete("/delete/:id", deleteIdeaCtrl);
ideasRouter.get("/by-session/:sessionId", getIdeasBySessionCtrl);
