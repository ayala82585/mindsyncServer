import { deleteResponse } from '../controllers/IdeaResponseController';
import { insertIdea, isParticipant, getIdeasFromSession, updateIdea, deleteIdea, getIdeasBySessionDAL } from '../dal/ideaDal';
import database from '../database';
import { ideas } from '../models/Idea';
const pool = database.getPool();


async function createIdeaService(params: { sessionId: number; authorId: string; text: string; }): Promise<ideas> {

  const { sessionId, authorId, text } = params;
  const ok = await isParticipant(sessionId, authorId);

  if (!ok) {
    const err: any = new Error('not_a_participant');
    err.status = 403;
    throw err;
  }

  return insertIdea(sessionId, authorId, text.trim());
}

// קבלת רעיונות לפי מזהה session, עם אפשרות לסינון לפי זמן
async function fetchSessionIdeas(sessionId: number, since?: string) {
  return await getIdeasFromSession(sessionId, since);
}

export const updateIdeaService = async (id: number, uid: string, data: Partial<ideas>) => {

  const ideaResult = await pool.query(
    `SELECT * FROM ideas WHERE id = $1`,
    [id]
  );
  if (ideaResult.rows.length === 0) {
    throw new Error("Idea not found");
  }
  const idea = ideaResult.rows[0];
  console.log(idea.session_id);

  // שלב 2: בדיקת קיום הסשן של הרעיון
  const sessionResult = await pool.query(
    `SELECT * FROM sessions WHERE id = $1`,
    [data.sessionId]
  );
console.log(data);

  if (sessionResult.rows.length === 0) {
    throw new Error("Session not found");
  }
  if(idea.session_id !== data.sessionId){
    throw new Error("Cannot change sessionId of the idea");
  }
  if (idea.author_id !== uid) {
    throw new Error("You are not allowed to update this idea");
  }

  return updateIdea(id, data);
};

export const deleteIdeaService = async (id: number, uid: string) => {
  const ideaResult = await pool.query(
    `SELECT * FROM ideas WHERE id = $1`,
    [id]
  );
  if (ideaResult.rowCount === 0) {
    throw new Error("Idea not found");
  }
  if (ideaResult.rows[0].author_id !== uid) {
    throw new Error("You are not allowed to delete this idea");
  }
console.log(ideaResult.rows[0].author_id);

  return deleteIdea(id);
};

export async function getIdeasBySessionService(sessionId: number) {
  return await getIdeasBySessionDAL(sessionId);
}
export { createIdeaService, fetchSessionIdeas };