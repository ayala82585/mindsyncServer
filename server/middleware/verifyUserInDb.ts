import { Request, Response, NextFunction } from "express";
import UserDAL from "../dal/userDal";

const userDal = new UserDAL();

export async function verifyUserInDb(req: Request, res: Response, next: NextFunction) {
const uid = (req as any).uid;
if (!uid) {
return res.status(401).json({ error: "Missing UID from Firebase token" });
}


try {
const user = await userDal.getUserByUid(uid);
if (!user) {
return res.status(403).json({ error: "User not found in local database" });
}
(req as any).user = user; // נצרף את המשתמש לבקשה
next();
} catch (error) {
console.error("verifyUserInDb error:", error);
return res.status(500).json({ error: "Internal server error" });
}
}
