// import { Request, Response, NextFunction } from "express";
// import * as admin from "firebase-admin"; // Import firebase-admin


// interface AuthenticatedRequest extends Request {
//   user?: { 
//     uid: string;
//     email: string | null;
    
//   };
// }

// export async function authenticate(
//   req: AuthenticatedRequest, 
//   res: Response,
//   next: NextFunction
// ) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     console.warn("Authentication: No Bearer token or malformed header.");
//     return res.status(401).json({ error: "Authorization header missing or malformed (expected 'Bearer <token>')." });
//   }

//   const idToken = authHeader.split(" ")[1];
//     console.log('1.2 authMiddleware: Extracted ID Token. Length:', idToken.length, 'Starts with:', idToken.substring(0, 10)); // <--- לוג חדש: מראה את הטוקן

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     console.log('1.4 authMiddleware: ID Token verified successfully! UID:', decodedToken.uid); // <--- לוג חדש: אחרי הצלחה
//     req.user = {
//       uid: decodedToken.uid,
//       email: decodedToken.email || null,
//     };
//         console.log('1.5 authMiddleware: Calling next().'); // <--- לוג חדש: לפני next()
//     console.log('1.2 authMiddleware: Token verified, calling next(). UID:', req.user.uid); // חדש
//     next();
//   } catch (error: any) {
//     console.error("1.3 authMiddleware: Error verifying Firebase ID token:", error); // חדש

//     let errorMessage = "Authentication failed.";
//     let statusCode = 401; // Unauthorized

//     switch (error.code) {
//       case "auth/argument-error":
//         errorMessage = "Invalid ID token provided.";
//         break;
//       case "auth/id-token-expired":
//         errorMessage = "ID token has expired. Please re-authenticate.";
//         break;
//       case "auth/id-token-revoked":
//         errorMessage = "ID token has been revoked. Please re-authenticate.";
//         break;
//       case "auth/user-disabled":
//         errorMessage = "The user associated with this token is disabled.";
//         break;
//       default:
//         // Generic error for other unexpected issues
//         errorMessage = "Failed to authenticate token.";
//         break;
//     }

//     return res.status(statusCode).json({ error: errorMessage });
//   }
// }

// export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     console.log('1. authMiddleware: Request received.'); // חדש
//   const authHeader = req.headers.authorization;

//   // 1. ודא שכותרת Authorization קיימת ובפורמט Bearer Token
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         console.log('1.1 authMiddleware: No token or invalid format.'); // חדש
//     return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format.' });
//   }
// }




 
// middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import * as admin from 'firebase-admin'; // וודא שיש לך את הייבוא הנכון של admin

// הגדרת אינטרפייס עבור Request מאומת
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string | null; // אימייל יכול להיות אופציונלי או null
      };
    }
  }
}

// זו הפונקציה שצריכה להכיל את כל הלוגיקה.
// נשלב לתוכה את הקוד שהיה בפונקציית "authenticate" שלך.
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log('1. authMiddleware: Request received.'); // לוג 1

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('1.1 authMiddleware: No token or invalid format. Sending 401.'); // לוג 1.1
    return res.status(401).json({ error: "Authorization header missing or malformed (expected 'Bearer <token>')." });
  }

  const idToken = authHeader.split(" ")[1];
  console.log('1.2 authMiddleware: Extracted ID Token. Length:', idToken.length, 'Starts with:', idToken.substring(0, 10)); // לוג 1.2

  try {
    console.log('1.3 authMiddleware: Attempting to verify ID Token...'); // לוג חדש שהוספנו קודם
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('1.4 authMiddleware: ID Token verified successfully! UID:', decodedToken.uid); // לוג 1.4

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null, // ודא ש-email אופציונלי
    };

    console.log('1.5 authMiddleware: Calling next().'); // לוג 1.5
    next(); // <--- קריטי: מעביר את הבקשה הלאה ל-controller
  } catch (error: any) {
    console.error("1.6 authMiddleware: Error during token verification (caught). Error:", error); // לוג 1.6

    let errorMessage = "Authentication failed.";
    let statusCode = 401; // Unauthorized

    switch (error.code) {
      case "auth/argument-error":
        errorMessage = "Invalid ID token provided.";
        break;
      case "auth/id-token-expired":
        errorMessage = "ID token has expired. Please re-authenticate.";
        break;
      case "auth/id-token-revoked":
        errorMessage = "ID token has been revoked. Please re-authenticate.";
        break;
      case "auth/user-disabled":
        errorMessage = "The user associated with this token is disabled.";
        break;
      default:
        // Generic error for other unexpected issues
        errorMessage = "Failed to authenticate token.";
        break;
    }

    return res.status(statusCode).json({ error: errorMessage });
  }
};

  
