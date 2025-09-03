import database from '../database'; 
import { ideas } from '../models//Idea';

const pool = database.getPool();

export async function isParticipant(sessionId: number, userId: string): Promise<boolean> {
  const r = await pool.query(
    `SELECT 1 FROM session_participants WHERE session_id=$1 AND user_id=$2`,
    [sessionId, userId]
  );
  return r.rowCount !== null && r.rowCount > 0;
}

export async function insertIdea(sessionId: number, authorId: string, text: string): Promise<ideas> {
  const sql = `
    INSERT INTO ideas (session_id, author_id, text)
    VALUES ($1, $2, $3)
    RETURNING id, session_id as "sessionId", author_id as "authorId", text, created_at as "createdAt"
  `;
  const r = await pool.query(sql, [sessionId, authorId, text]);
  return r.rows[0];
}

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

export async function updateIdeaReaction(ideaId: number, reaction: string) {
  const query = `
    UPDATE ideas
    SET ${reaction} = ${reaction} + 1,
        updated_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [ideaId]);
  return result.rows[0];
}