import { Request, Response, NextFunction } from 'express';

// בדיקה האם למשתמש יש הרשאות אדמין
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const decodedToken = (req as any).firebaseDecoded;  
  if (!decodedToken?.admin && decodedToken?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}





