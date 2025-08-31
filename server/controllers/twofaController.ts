
import { Request, Response } from "express";
import { generate2FASecret, verify2FA } from "../service/twofaService";
// נניח שיש לך DAL עם usersDal.updateUser ו־usersDal.getByUid
import usersDal from "../dal/userDal";

export const enable2FA = async (req: Request, res: Response) => {
  const { uid, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: "Missing uid or email" });
  }

  try {
    const { secret, qr } = await generate2FASecret(email);

    // לשמור במסד
    await usersDal.updateUser(uid, {
      preferences: { twofa_secret: secret, twofa_enabled: true },
    });

    res.json({ message: "2FA enabled", qr, secret });
  } catch (err) {
    console.error("❌ enable2FA error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verify2FAController = async (req: Request, res: Response) => {
  const { uid, token } = req.body;

  if (!uid || !token) {
    return res.status(400).json({ error: "Missing uid or token" });
  }

  try {
    const user = await usersDal.getByUid(uid);
    if (!user || !user.twofa_secret) {
      return res.status(400).json({ error: "2FA not enabled" });
    }

    const isValid = verify2FA(token, user?.twofa_secret);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    res.json({ message: "2FA verification successful" });
  } catch (err) {
    console.error("❌ verify2FA error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};