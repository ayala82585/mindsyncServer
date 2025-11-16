import database from '../database'; 
import { sessions } from '../models/Session';

const pool = database.getPool();
 
// הוספת סשן חדש והחזרת הפרטים שלו
export async function insertSession(title: string, description: string, password_hash: string, ownerUid: string): Promise<sessions> {

  const sql = `
    INSERT INTO sessions (title, description, password_hash, owner_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, password_hash,  owner_id as "ownerId", created_at as "createdAt"
  `;
  const r = await pool.query(sql, [title, description, password_hash, ownerUid]);
  
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
  return r.rowCount !== null && r.rowCount > 0 ? r.rows[0] : null;
}

// קבלת סשן לפי מזהה
export const getSessionById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM sessions WHERE id = $1`, [id]);
  return result.rows[0];
};

// קבלת סשן לפי שם
export const getSessionByName = async (name: string) => {
  const result = await pool.query(`SELECT * FROM sessions WHERE title = $1`, [name]);
  return result.rows[0];
};

export async function getAllSessionsDAL() {
  const result = await pool.query("SELECT * FROM sessions ORDER BY created_at DESC");
  return result.rows;
}

export async function getSessionsByUserIdDAL(userId: string) {
  const result = await pool.query(
    `
    SELECT s.*
    FROM sessions s
    JOIN session_participants sp ON s.id = sp.session_id
    WHERE sp.user_id = $1
    ORDER BY s.created_at DESC
    `,
    [userId]
  );
  return result.rows;
}