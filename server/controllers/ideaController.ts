import { Request, Response, NextFunction } from 'express';
import { createIdeaService } from '../service/ideaService';

export async function createIdeaCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = (req as any).uid;
    const { sessionId, text } = req.body || {};
    if (!uid) return res.status(401).json({ error: 'unauthorized' });

    const sid = Number(sessionId);
    if (!Number.isInteger(sid)) return res.status(400).json({ error: 'sessionId must be integer' });
    if (!text || typeof text !== 'string' || text.trim().length === 0)
      return res.status(400).json({ error: 'text is required' });

    const idea = await createIdeaService({ sessionId: sid, authorId: uid, text });
    return res.status(201).json(idea);
  } catch (e) { next(e); }
}