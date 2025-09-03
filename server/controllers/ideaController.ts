import { Request, Response, NextFunction } from 'express';
import { createIdeaService, fetchSessionIdeas, incrementReaction  } from '../service/ideaService';

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

export const getIdeasBySession = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    const since = req.query.since as string | undefined;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });
    const ideas = await fetchSessionIdeas(Number(sessionId), since);
    res.json(ideas);
  } catch (err) {
    console.error("Error fetching ideas:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reactToIdea = async (req: Request, res: Response) => {
  try {
    const { ideaId } = req.params;
    const { reaction } = req.body;
    if (!reaction) return res.status(400).json({ error: "Missing reaction" });
    const updated = await incrementReaction(Number(ideaId), reaction);
    res.json(updated);
  } catch (err) {
    console.error("Error reacting to idea:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

