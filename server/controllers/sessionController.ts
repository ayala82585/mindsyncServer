import { Request, Response, NextFunction } from 'express';
import { createSessionService, joinSessionService , generateSessionJoinLink } from '../service/sessionService';
import { setUserRole } from '../service/userService';

// יצירת סשן חדש
async function createSessionCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const ownerUid = (req as any).uid;
    const { title, description , password} = req.body || {};

    if (!ownerUid)
      return res.status(401).json({ error: 'unauthorized' });

    if (!title || typeof title !== 'string' || title.trim().length === 0)
      return res.status(400).json({ error: 'title is required' });

    if (!description || typeof description !== 'string')
      return res.status(400).json({ error: 'description is required' });

    if (!password || typeof description !== 'string')
      return res.status(400).json({ error: 'password is required' });

    const result = await createSessionService({ title, description, password,ownerUid });
    const joinLink = generateSessionJoinLink(result.id , password); // או result.id – לפי מה שה־service מחזיר

    await setUserRole(ownerUid, 'session_owner');

    return res.status(201).json({ ...result, joinLink });

  } catch (error) {
    next(error);
  }
}
  
// הצטרפות לסשן קיים
async function joinSessionCtrl(req: Request, res: Response, next: NextFunction) {

  try {
    const uid = (req as any).uid;
    const { password } = req.body;
    const sid = Number(req.params.id);

    if (!uid)
      return res.status(401).json({ error: 'unauthorized' });

    if (!Number.isInteger(sid))
      return res.status(400).json({ error: 'invalid session id' });

    const result = await joinSessionService(sid,password, uid);
    return result === 'created' ? res.status(201).end() : res.status(204).end();
  }
  catch (e) {
    next(e);
  }
}

export { createSessionCtrl, joinSessionCtrl };