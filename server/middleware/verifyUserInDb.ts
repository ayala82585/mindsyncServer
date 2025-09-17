import { Request, Response, NextFunction } from "express";
import UserDAL from "../dal/userDal";

const userDal = new UserDAL();

// אימות שהמשתמש קיים בבסיס הנתונים המקומי
export async function verifyUserInDb(req: Request, res: Response, next: NextFunction) {
    //const uid = (req as any).uid;
    const uid = req.uid;

    if (!uid) {
        return res.status(401).json({ error: "Missing UID from Firebase token" });
    }
    try {
        const user = await userDal.getUserByUid(uid);
        if (!user) {
            return res.status(403).json({ error: "User not found in local database" });
        }
       // (req as any).user = user;
       req.user = user;

        next();
    } 
    catch (error) {
        console.error("verifyUserInDb error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
