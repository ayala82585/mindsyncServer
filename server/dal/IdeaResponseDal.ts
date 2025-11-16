import { IdeaResponse } from "../models/IdeaResponse";
import database from '../database';

const pool = database.getPool();

// פונקציה להוספה, עדכון ומחיקת תגובות לרעיונות

export const addResponse = async (idea_id: number, user_id: string, emoji?: string,
  text?: string
) => {
  try {
  console.log({ idea_id, user_id, emoji, text });

  const result = await pool.query(
    `INSERT INTO idea_responses (idea_id, user_id, emoji, text)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [idea_id, user_id, emoji || null, text || null]
  );

  return result.rows[0];
  } catch (error) {
    console.error("Error in addResponse:", error);
    throw error;
  }
};

// פונקציה לעדכון תגובה לרעיון
export const updateResponse = async (id: number, response: Partial<IdeaResponse>) => {
  try {
    const { emoji, text } = response;
    if (!emoji && !text) {
      throw new Error("At least one of 'emoji' or 'text' must be provided");
    }
    const result = await pool.query(
      `UPDATE idea_responses
       SET emoji = $1, text = $2
       WHERE id = $3
       RETURNING *`,
      [emoji || null, text || null, id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in updateResponse:", error);
    throw error;
  }
};

// פונקציה למחיקת תגובה לרעיון
export const deleteResponse = async (id: number) => {
  try {
    await pool.query(`DELETE FROM idea_responses WHERE id = $1`, [id]);
  } catch (error) {
    console.error("Error in deleteResponse:", error);
    throw error;
  }
};

export const getResponsesByIdeaId = async (idea_id: number) => {
  try {
    const result = await pool.query(
      `SELECT * FROM idea_responses WHERE idea_id = $1 ORDER BY created_at ASC`,
      [idea_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error in getResponsesByIdea:", error);
    throw error;
  }
};