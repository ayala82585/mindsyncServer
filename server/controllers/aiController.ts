import { Request, Response } from "express";
import { handleAIRequest } from "../service/aiService";
import { sessionExists } from "../dal/sessionDal"; // בהנחה שיש DAL ל-sessions

// Controller לטיפול בבקשות AI
export const processAI = async (req: Request, res: Response) => {
try {
  
const { sessionId, mode } = req.body as {
sessionId: number;
mode: "summarize" | "cluster";
};

const user = req.user;
if (!user) {
  return res.status(401).json({ error: "Unauthorized" });
}

const userId = user.uid;

const session = await sessionExists(sessionId);

if (!session) {
return res.status(404).json({ error: "סשן לא נמצא" });
}

const result = await handleAIRequest({
userId,
sessionOwnerId: session.owner_id,
mode,
session_id: sessionId,
});


res.json({
success: true,
model: result.modelUsed,
message: "[דמו בלבד] ה-AI יחזור בתשובה אמיתית כאן בעתיד",
});
} catch (err: any) {
res.status(400).json({ error: err.message });
}
};