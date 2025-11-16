import { addParticipant, getAllSessionsDAL, getSessionById, getSessionByName, getSessionsByUserIdDAL, insertSession, sessionExists } from '../dal/sessionDal';
import { sessions } from '../models/Session';
import { encrypt } from '../utils/crypto';
import { hashPassword, verifyPassword } from '../utils/hash';


// יצירת סשן חדש
async function createSessionService(params: { title: string; description: string; password: string; ownerUid: string; }): Promise<sessions> {

  const { title, description, password, ownerUid } = params;

  const passwordHash = await hashPassword(password);

  const s = await insertSession(title.trim(), description, passwordHash, ownerUid);
  // generateSessionJoinLink(s.id);
  await addParticipant(s.id, ownerUid);
  //generateSessionJoinLink(s.id , password );
  return s;
}

// הצטרפות לסשן קיים
async function joinSessionService(sessionId: number, password: string, userId: string): Promise<'created' | 'exists'> {

  const exists = await sessionExists(sessionId);

  if (!exists) {
    const err: any = new Error('session_not_found');
    err.status = 404;
    throw err;
  }
  const isValid = await verifyPassword(password, exists.password_hash);
  if (!isValid) throw new Error('Invalid password');
  console.log("Password verified" + exists.password_hash);
  const rc = await addParticipant(sessionId, userId);
  return rc === 1 ? 'created' : 'exists';
}

// יצירת קישור הצטרxxx לסשן עם הצפנה
export function generateSessionJoinLink(sessionId: number, password: string): string {
  const SALT = process.env.SESSION_TOKEN_SUFFIX!;
  const payload = `${sessionId}|${SALT}|${password}`;
  const token = encrypt(payload);
  return `${encodeURIComponent(token)}`;
}

// חיפוש סשן לפי מזהה או שם
export const findSession = async (identifier: string, password: string) => {
  const isId = /^\d+$/.test(identifier); // בדיקה אם כל התווים מספריים
  let session;
  if (isId) {
    session = await getSessionById(Number(identifier));
  } else {
    session = await getSessionByName(identifier);
  }

  if (!session) {
    throw new Error("Session not found");
  }
  const isValid = await verifyPassword(password, session.password_hash);
  if (!isValid) throw new Error('Invalid password');
  console.log("Password verified" + session.password_hash);
  return session;
};

export async function getAllSessionsService() {
  return await getAllSessionsDAL();
}

export async function getSessionsByUserIdService(userId: string) {
  return await getSessionsByUserIdDAL(userId);
}
export { createSessionService, joinSessionService };