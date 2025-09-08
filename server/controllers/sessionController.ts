import { Request, Response, NextFunction } from 'express';
import { createSessionService, joinSessionService } from '../service/sessionService';
import { setUserRole } from '../service/userService';

export async function createSessionCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const ownerUid = (req as any).uid;
    const { title, description } = req.body || {};

    if (!ownerUid) return res.status(401).json({ error: 'unauthorized' });

    if (!title || typeof title !== 'string' || title.trim().length === 0)
      return res.status(400).json({ error: 'title is required' });

    if (!description || typeof description !== 'string')
      return res.status(400).json({ error: 'description is required' });

    const s = await createSessionService({ title, description, ownerUid });
    await setUserRole(ownerUid, 'session_owner');

    return res.status(201).json(s);

  } catch (e) { next(e); }
}

export async function joinSessionCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = (req as any).uid;
    const sid = Number(req.params.id);
    if (!uid) return res.status(401).json({ error: 'unauthorized' });
    if (!Number.isInteger(sid)) return res.status(400).json({ error: 'invalid session id' });
    const result = await joinSessionService(sid, uid);
    return result === 'created' ? res.status(201).end() : res.status(204).end();
  } catch (e) { next(e); }
}
