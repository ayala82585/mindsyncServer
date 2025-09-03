import { insertIdea, isParticipant, getIdeasFromSession, updateIdeaReaction } from '../dal/ideaDal';
import {ideas} from '../models/Idea';

export async function createIdeaService(params: {
  sessionId: number; authorId: string; text: string;
}): Promise<ideas> {
  const { sessionId, authorId, text } = params;
  // בדיקה עסקית – המחבר חייב להיות משתתף בסשן
  const ok = await isParticipant(sessionId, authorId);
  if (!ok) {
    const err: any = new Error('not_a_participant');
    err.status = 403;
    throw err;
  }
  return insertIdea(sessionId, authorId, text.trim());
}

export async function fetchSessionIdeas(sessionId: number, since?: string) {
  return await getIdeasFromSession(sessionId, since);
}

export async function incrementReaction(ideaId: number, reaction: string) {
  // ודא שהתגובה חוקית
  const allowed = ["likes", "dislikes", "laughs", "sad", "angry"];
  if (!allowed.includes(reaction)) {
    throw new Error("Invalid reaction type");
  }
  return await updateIdeaReaction(ideaId, reaction);
}

