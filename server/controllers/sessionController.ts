import { Request, Response, NextFunction } from 'express';
import { createSessionService, joinSessionService, generateSessionJoinLink, findSession, getAllSessionsService, getSessionsByUserIdService } from '../service/sessionService';
import { setUserRole } from '../service/userService';

// יצירת סשן חדש
async function createSessionCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const ownerUid = req.user?.uid;
    const { title, description, password } = req.body || {};

    if (!ownerUid)
      return res.status(401).json({ error: 'unauthorized' });

    if (!title || typeof title !== 'string' || title.trim().length === 0)
      return res.status(400).json({ error: 'title is required' });

    if (!description || typeof description !== 'string')
      return res.status(400).json({ error: 'description is required' });

    if (!password || typeof password !== 'string')
      return res.status(400).json({ error: 'password is required' });

    const result = await createSessionService({ title, description, password, ownerUid });

    const joinLink = generateSessionJoinLink(result.id, password);

    await setUserRole(ownerUid, 'session_owner');

    return res.status(201).json({ result, joinLink });

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

    const result = await joinSessionService(sid, password, uid);
    const session = await findSession(String(sid), password);
    console.log(session);

    res.status(200).json(session);
    // return result === 'created' ? res.status(201).end() : res.status(204).end();
  }
  catch (e) {
    next(e);
  }
}

// מציאת סשן לפי מזהה או שם
export const getSessionHandler = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const { password } = req.body;

    const session = await findSession(identifier, password);

    res.status(200).json(session);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export async function getAllSessionsCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const sessions = await getAllSessionsService();

    if (!Array.isArray(sessions)) {
      return res.status(500).json({ error: "Unexpected data format" });
    }

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
}

export async function getSessionsByUserCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.user?.uid;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const sessions = await getSessionsByUserIdService(uid);

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
}
export { createSessionCtrl, joinSessionCtrl };