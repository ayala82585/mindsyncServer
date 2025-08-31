
import { Router } from "express";
import { enable2FA, verify2FAController } from "../controllers/twofaController";

const router = Router();

// POST http://localhost:4000/api/2fa/enable
router.post("/enable", enable2FA);

// POST http://localhost:4000/api/2fa/verify
router.post("/verify", verify2FAController);

export default router;