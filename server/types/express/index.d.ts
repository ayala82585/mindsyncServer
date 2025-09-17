import { User } from "../../models/User"; // התאימי את הנתיב למיקום האמיתי של הקובץ שלך
import admin from "firebase-admin";       // נדרש בשביל UserRecord

declare global {
  namespace Express {
    interface Request {
      /**
       * מזהה ייחודי של המשתמש שהגיע מה-Firebase
       * (מוזרק ע"י ה-middleware שלך)
       */
      uid?: string;

      /**
       * מידע נוסף מה-token של Firebase, כולל תפקידים (admin וכו')
       */
      firebaseDecoded?: {
        uid: string;
        admin?: boolean;
        role?: string;
        [key: string]: any;
      };
      firebaseUser?: admin.auth.UserRecord;

      /**
       * אובייקט המשתמש מהדאטהבייס שלך
       */
      user?: User;
    }
  }
}

export {};