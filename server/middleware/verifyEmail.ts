import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// מידלוור לאימות שהאימייל של המשתמש מאומת
export async function verifyEmailMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const idToken = authHeader?.split(" ")[1];
    if (!idToken) {
      return res.status(401).send("Missing token");
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await admin.auth().getUser(decoded.uid);
    if (!user.emailVerified) {
      return res.status(403).send("Email not verified");
    }
    (req as any).user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send("Unauthorized");
  }
}
