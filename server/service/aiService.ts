import userDAL from "../dal/userDal";

interface AIRequestParams {
    userId: string;
    sessionOwnerId: string;
    mode: "summarize" | "cluster";
}

const userDal = new userDAL();

// טיפול בבקשת AI עם בדיקות קרדיטים ותפקיד
export const handleAIRequest = async ({ userId, sessionOwnerId, mode }: AIRequestParams) => {
    if (userId !== sessionOwnerId) {
        throw new Error("רק מנהל הסשן יכול לבצע קריאה ל-AI");
    }
    const user = await userDal.getUserByUid(userId);

    if (!user || user.aiSessionCredits <= 0) {
        throw new Error("אין קרדיטים זמינים");
    }

    const model =
        user.aiMode === "paid"
            ? mode === "summarize"
                ? "gpt-4o"
                : "gpt-3.5-turbo"
            : "gpt-3.5-turbo";
            
    await userDal.decrementCredits(userId, 1);
    return { modelUsed: model };
};
