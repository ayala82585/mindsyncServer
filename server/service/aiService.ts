
import { logAIUsage } from "../dal/aiDal";
import userDAL from "../dal/userDal";

interface AIRequestParams {
    userId: string;
    sessionOwnerId: string;
    mode: "summarize" | "cluster";
    session_id: number;
}

const userdal = new userDAL();

export const handleAIRequest = async ({ userId, sessionOwnerId, mode, session_id }: AIRequestParams) => {

    if (userId !== sessionOwnerId) {
        throw new Error("רק מנהל הסשן יכול לבצע קריאה ל-AI");
    }

    const user = await userdal.getUserByUid(userId);

    if (!user || user.aisessioncredits <= 0) {
        throw new Error("אין קרדיטים זמינים");
    }

    console.log("oooo" + user.aimode);

    const model =
        user.aimode === "paid"
            ? mode === "summarize"
                ? "gpt-4o"
                : "gpt-3.5-turbo"
            : "gpt-3.5-turbo";

    await userdal.decrementCredits(userId, 1);

    await logAIUsage({
        userId,
        sessionId: session_id, // או אולי sessionId אמיתי אם קיים
        modelUsed: model,
        mode,
        tokensUsed: 1, // :large_yellow_circle: כאן שימי את מספר הטוקנים האמיתי מהמודל
    });

    return { modelUsed: model };
};
