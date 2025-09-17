import express from "express";
import { processAI } from "../controllers/aiController";
import { requireFirebaseAuth } from "../middleware/auth";
import { verifyUserInDb } from "../middleware/verifyUserInDb";


const router = express.Router();

 router.use(requireFirebaseAuth,verifyUserInDb);

router.post("/process", processAI);


export default router;