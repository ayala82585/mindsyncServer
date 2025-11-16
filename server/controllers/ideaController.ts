import { Request, Response, NextFunction } from 'express';
import { createIdeaService, deleteIdeaService, fetchSessionIdeas, getIdeasBySessionService, updateIdeaService } from '../service/ideaService';
import { io } from '../index'; // או מהנתיב הרלוונטי

// יצירת רעיון חדש
async function createIdeaCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.user?.uid;

    const { sessionId, text } = req.body;
    const sid = parseInt(sessionId, 10);
    if (isNaN(sid)) {
      return res.status(400).json({ error: 'sessionId must be a valid number' });
    }
    if (!uid)
      return res.status(401).json({ error: 'unauthorized' });
    if (!Number.isInteger(sid))
      return res.status(400).json({ error: 'sessionId must be integer' });
    if (!text || typeof text !== 'string' || text.trim().length === 0)
      return res.status(400).json({ error: 'text is required' });

    const MAX_CHARS = 50;
    if (text.length > MAX_CHARS) {
      return res.status(400).json({ error: `Idea text must not exceed ${MAX_CHARS} characters` });
    }

    const idea = await createIdeaService({ sessionId: sid, authorId: uid, text });
    io.to(`session_${sid}`).emit('newIdea', idea);
    console.log('📤 שידור רעיון חדש לחדר:', `session_${sid}`);

    return res.status(201).json(idea);
  }
  catch (e) { next(e); }
}

// קבלת רעיונות לפי מזהה session, עם אפשרות לסינון לפי זמן
// const getIdeasBySession = async (req: Request, res: Response) => {

//   try {
//     const sessionId = req.params.sessionId;
//     const since = req.query.since as string | undefined;

//     if (!sessionId)
//       return res.status(400).json({ error: "Missing sessionId" });

//     const ideas = await fetchSessionIdeas(Number(sessionId), since);
//     res.json(ideas);

//   } catch (err) {
//     console.error("Error fetching ideas:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const updateIdeaCtrl = async (req: any, res: any) => {
  try {
    const  id  = Number(req.params.id);
    const data = req.body;
    const uid = req.user?.uid;
    if ( !data.text) {
      throw new Error("Text must be provided");
    }
    const result = await updateIdeaService(id, uid, data);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateIdea:", error);
    throw error;
  }
};

export const deleteIdeaCtrl = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    const uid = req.user?.uid;
    await deleteIdeaService(id, uid);
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteIdea:", error);
    throw error;
  }
};

export async function getIdeasBySessionCtrl(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = Number(req.params.sessionId);

    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    const ideas = await getIdeasBySessionService(sessionId);
    res.status(200).json(ideas);
  } catch (error) {
    next(error);
  }
}
export { createIdeaCtrl };
//, getIdeasBySession