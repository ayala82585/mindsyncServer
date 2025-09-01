import { addParticipant, insertSession, sessionExists } from '../dal/sessionDal';
import { sessions } from '../models/Session';

export async function createSessionService(params: {
  title: string; description: string; ownerUid: string;
}): Promise<sessions> {
  const { title, description, ownerUid } = params;
  const s = await insertSession(title.trim(), description, ownerUid);
  // רישום בעלים כמשתתף
  await addParticipant(s.id, ownerUid);
  return s;
}
export async function joinSessionService(sessionId: number, userId: string): Promise<'created' | 'exists'> {
  const exists = await sessionExists(sessionId);
  if (!exists) {
    const err: any = new Error('session_not_found');
    err.status = 404;
    throw err;
  }
  const rc = await addParticipant(sessionId, userId);
  return rc === 1 ? 'created' : 'exists';
}