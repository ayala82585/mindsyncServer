import { IdeaResponse } from '../models/IdeaResponse';
import { addResponse, deleteResponse, getResponsesByIdeaId, updateResponse } from '../dal/IdeaResponseDal';
import database from '../database';
import e from 'express';
const pool = database.getPool();

export const addResponseService = async (idea_id: number, user_id: string, emoji?: string, text?: string) => {
  console.log("Service result:", { idea_id, user_id, emoji, text });
  const ideaResult = await pool.query(
    `SELECT session_id FROM ideas WHERE id = $1`,
    [idea_id]
  );
  if (ideaResult.rowCount === 0) {
    throw new Error("Idea not found");
  }
  const session_id = ideaResult.rows[0].session_id;
  const participantResult = await pool.query(
    `SELECT * FROM session_participants WHERE session_id = $1 AND user_id = $2`,
    [session_id, user_id]
  );
  if (participantResult.rowCount === 0) {
    throw new Error("User is not authorized to respond to this idea");
  }
  return await addResponse(idea_id, user_id, emoji, text);
};

export const updateResponseService = async (id: number, data: Partial<IdeaResponse>) => { 
   const ideaResult = await pool.query(
    `SELECT id FROM idea_responses WHERE id = $1`,
    [id]
  );
  if (ideaResult.rowCount === 0) {
    throw new Error("Response not found");
  }
  return updateResponse(id, data);
};
 
export const deleteResponseService = async (id: number) => {  
  const ideaResult = await pool.query(
    `SELECT id FROM idea_responses WHERE id = $1`,
    [id]
  );
  if (ideaResult.rowCount === 0) {
    throw new Error("Response not found");
  }
  return deleteResponse(id);
};

export async function fetchResponsesForIdea(ideaId: number) {
  return await getResponsesByIdeaId(ideaId);
}
