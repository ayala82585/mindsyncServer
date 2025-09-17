import { Request, Response } from "express";
import { handleAIRequest } from "../service/aiService";
import { sessionExists } from "../dal/sessionDal";

// עיבוד בקשת AI עם בדיקות קרדיטים ותפקיד
export const processAI = async (req: Request, res: Response) => {
    try {
        const { sessionId, mode } = req.body as {
            sessionId: number;
            mode: "summarize" | "cluster";
        };

        const { userId } = req.params;
        // const userId = (req.user as { id: string }).id;
        const session = await sessionExists(sessionId);

        if (!session) {
            return res.status(404).json({ error: "סשן לא נמצא" });
        }

        const result = await handleAIRequest({
            userId,
            sessionOwnerId: session.ownerId,
            mode,
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