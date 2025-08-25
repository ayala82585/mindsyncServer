import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin"; // Import firebase-admin


interface AuthenticatedRequest extends Request {
  user?: { 
    uid: string;
    email: string | null;
    
  };
}

export async function authenticate(
  req: AuthenticatedRequest, 
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("Authentication: No Bearer token or malformed header.");
    return res.status(401).json({ error: "Authorization header missing or malformed (expected 'Bearer <token>')." });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
    };
    console.log(`Authentication: Token verified for UID: ${decodedToken.uid}`);
    next();
  } catch (error: any) {
    console.error("Authentication Error:", error.code, error.message);

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
}
