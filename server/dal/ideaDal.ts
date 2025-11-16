import database from '../database'; 
import { ideas } from '../models//Idea';

const pool = database.getPool();

// בדיקה אם המשתמש הוא משתתף ב-session
export async function isParticipant(sessionId: number, userId: string): Promise<boolean> {

  const r = await pool.query(
    `SELECT 1 FROM session_participants WHERE session_id=$1 AND user_id=$2`,
    [sessionId, userId]
  );
  return r.rowCount !== null && r.rowCount > 0;
}

// יצירת רעיון חדש
export async function insertIdea(sessionId: number, authorId: string, text: string): Promise<ideas> {

  const sql = `
    INSERT INTO ideas (session_id, author_id, text)
    VALUES ($1, $2, $3)
    RETURNING id, session_id as "sessionId", author_id as "authorId", text, created_at as "createdAt"
  `;
  const r = await pool.query(sql, [sessionId, authorId, text]);
  return r.rows[0];
}

// קבלת רעיונות לפי מזהה session, עם אפשרות לסינון לפי זמן
export async function getIdeasFromSession(sessionId: number, since?: string) {

  const values: any[] = [sessionId];
  let query = `
    SELECT * FROM ideas
    WHERE session_id = $1
  `;

  if (since) {
    query += ` AND GREATEST(created_at, updated_at) > $2`;
    values.push(since);
  }

  query += ` ORDER BY created_at ASC`;

  const result = await pool.query(query, values);
  return result.rows;
}

export const updateIdea = async (id: number, response: Partial<ideas>) => {
  try {
    const { text } = response;
    if ( !text) {
      throw new Error("Text must be provided");
    }
    const result = await pool.query(
      `UPDATE ideas
       SET text = $1
       WHERE id = $2
       RETURNING *`,
      [text || null, id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in updateIdea:", error);
    throw error;
  }
};

export const deleteIdea = async (id: number) => {
  try {
    await pool.query(`DELETE FROM ideas WHERE id = $1`, [id]);
  } catch (error) {
    console.error("Error in deleteIdea:", error);
    throw error;
  }
};

export async function getIdeasBySessionDAL(sessionId: number) {
  const result = await pool.query("SELECT * FROM ideas WHERE session_id = $1 ORDER BY created_at ASC", [sessionId]);
  return result.rows;
}