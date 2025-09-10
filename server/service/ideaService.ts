import { insertIdea, isParticipant, getIdeasFromSession, updateIdeaReaction } from '../dal/ideaDal';
import { ideas } from '../models/Idea';

// יצירת רעיון חדש
async function createIdeaService(params: { sessionId: number; authorId: string; text: string; }): Promise<ideas> {

  const { sessionId, authorId, text } = params;
  const ok = await isParticipant(sessionId, authorId);

  if (!ok) {
    const err: any = new Error('not_a_participant');
    err.status = 403;
    throw err;
  }

  return insertIdea(sessionId, authorId, text.trim());
}

// קבלת רעיונות לפי מזהה session, עם אפשרות לסינון לפי זמן
async function fetchSessionIdeas(sessionId: number, since?: string) {
  return await getIdeasFromSession(sessionId, since);
}

// הוספת תגובה לרעיון (כגון לייק, אהבתי, וכו')
async function incrementReaction(ideaId: number, reaction: string) {

  const allowed = ["likes", "dislikes", "laughs", "sad", "angry"];

  if (!allowed.includes(reaction)) {
    throw new Error("Invalid reaction type");
  }

  return await updateIdeaReaction(ideaId, reaction);
}

export { createIdeaService, fetchSessionIdeas, incrementReaction };