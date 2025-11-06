import { addParticipant, insertSession, sessionExists } from '../dal/sessionDal';
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
async function joinSessionService(sessionId: number, password:string, userId: string): Promise<'created' | 'exists'> {

  const exists = await sessionExists(sessionId);

  if (!exists) {
    const err: any = new Error('session_not_found');
    err.status = 404;
    throw err;
  }
const isValid = await verifyPassword(password, exists.password_hash);
  if (!isValid) throw new Error('Invalid password');
console.log("Password verified" + exists.password_hash );
  const rc = await addParticipant(sessionId, userId);
  return rc === 1 ? 'created' : 'exists';
}

// יצירת קישור הצטרxxx לסשן עם הצפנה
export function generateSessionJoinLink(sessionId: number , password:string): string {
const SALT = process.env.SESSION_TOKEN_SUFFIX!;
const payload = `${sessionId}|${SALT}|${password}`;
const token = encrypt(payload);
return `${encodeURIComponent(token)}`;
}
export { createSessionService, joinSessionService };