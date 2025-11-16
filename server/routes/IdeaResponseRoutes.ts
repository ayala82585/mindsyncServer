import { Router } from "express";
import { requireFirebaseAuth } from "../middleware/auth";
import { verifyUserInDb } from "../middleware/verifyUserInDb";
import { addResponse, deleteResponse, getResponsesByIdeaController, updateResponse } from "../controllers/IdeaResponseController";

export const ideaResponsesRouter = Router();

ideaResponsesRouter.use(requireFirebaseAuth, verifyUserInDb);
ideaResponsesRouter.post("/create", addResponse);
ideaResponsesRouter.put("/update/:id", updateResponse);
ideaResponsesRouter.delete("/delete/:id", deleteResponse);
ideaResponsesRouter.get("/by-idea/:id", getResponsesByIdeaController);
export default ideaResponsesRouter;
