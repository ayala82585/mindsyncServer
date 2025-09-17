import database from '../database'; 
import { sessions } from '../models/Session';

const pool = database.getPool();
 
// הוספת סשן חדש והחזרת הפרטים שלו
export async function insertSession(title: string, description: string, ownerUid: string): Promise<sessions> {

  const sql = `
    INSERT INTO sessions (title, description, owner_id)
    VALUES ($1, $2, $3)
    RETURNING id, title, description, owner_id as "ownerId", created_at as "createdAt"
  `;
  const r = await pool.query(sql, [title, description, ownerUid]);
  
  return r.rows[0];
}

// הוספת משתתף לסשן, החזרת 1 אם נוסף, 0 אם כבר קיים
export async function addParticipant(sessionId: number, userId: string): Promise<number | null> {

  const sql = `
    INSERT INTO session_participants (session_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (session_id, user_id) DO NOTHING
  `;
  const r = await pool.query(sql, [sessionId, userId]);

  return r.rowCount; 
}

// בדיקת קיום סשן לפי מזהה
export async function sessionExists(sessionId: number): Promise<sessions | null> {
  
  const r = await pool.query(`SELECT * FROM sessions WHERE id=$1`, [sessionId]);
  console.log(r.rows[0]);
  
  return r.rowCount !== null && r.rowCount > 0 ? r.rows[0] : null;
}