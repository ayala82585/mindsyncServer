import express from "express";
import { processAI } from "../controllers/aiController";
import { requireFirebaseAuth } from "../middleware/auth";

const router = express.Router();

router.post("/process", requireFirebaseAuth, processAI);

export default router;