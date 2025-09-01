import { insertIdea, isParticipant } from '../dal/ideaDal';
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
