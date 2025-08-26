import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization Bearer token' });
  }

  const token = header.slice('Bearer '.length);
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).user = decoded; // הצמדה לבקשה
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as admin.auth.DecodedIdToken | undefined;
  if (!user || (!user.admin && user.role !== 'admin')) {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}