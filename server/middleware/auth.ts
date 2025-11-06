import { Request, Response, NextFunction } from "express";
import { verifyFirebaseToken } from "../Firebase";

// אימות Firebase רגיל
export async function requireFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";                         
    const idToken = header.startsWith("Bearer ") ? header.slice(7) : ""; 

            console.log("ppppppppppppppppppppppppppppppp");

    if (!idToken) 
      return res.status(401).json({ error: "missing id token" }); 

    const decoded = await verifyFirebaseToken(idToken);
                console.log("ttttttttttttttttttttttttttt");

    req.uid = decoded.uid;                    
    req.firebaseDecoded = decoded;
    
    next();
  } 
  catch (error: any) {
    console.error("Authenticationnn Error:", error.code, error.message);
    let errorMessage = "Authentication failed.";
    let statusCode = 401; 
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
        errorMessage = "Failed to authenticate token.";
        break;
    }
    return res.status(statusCode).json({ error: errorMessage });
  }
}

// אימות Firebase + דרישת MFA
export async function requireFirebaseAuthWithMfa(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const idToken = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!idToken)
       return res.status(401).json({ error: "missing id token" });
    const decoded = await verifyFirebaseToken(idToken);
    const mfaInfo = (decoded as any).firebase?.sign_in_second_factor;
    if (!mfaInfo) {
      return res.status(403).json({ error: "mfa required" });
    }
    req.firebaseDecoded = decoded;
    req.uid = decoded.uid;                    


    
    next();
  } catch (e) {
    return res.status(401).json({ error: "invalid id token" });
  }
}
