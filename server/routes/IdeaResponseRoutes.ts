import { Router } from "express";
import * as controller from "../controllers/IdeaResponseController";
import { requireFirebaseAuth } from "../middleware/auth";
import { verifyUserInDb } from "../middleware/verifyUserInDb";

const router = Router();
router.use(requireFirebaseAuth,verifyUserInDb);
router.post("/create", controller.addResponse);
router.put("/update/{id}", controller.updateResponse);
router.delete("/:id", controller.deleteResponse); router.get("/by-idea/:ideaId", controller.getResponsesByIdea);
export default router;