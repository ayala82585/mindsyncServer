import database from '../database';

export async function logAIUsage({
  userId,
  sessionId,
  modelUsed,
  mode,
  tokensUsed,
}: {
  userId: string;
  sessionId: number;
  modelUsed: string;
  mode: "summarize" | "cluster";
  tokensUsed: number;
}) 
{
    
await database.getPool().query(
    `
    INSERT INTO ai_usages (user_id, session_id, model_used, mode, tokens_used)
    VALUES ($1, $2, $3, $4, $5)
  `,
    [userId, sessionId, modelUsed, mode, tokensUsed]
  );
}
