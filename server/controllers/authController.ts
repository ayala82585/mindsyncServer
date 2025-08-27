
import { Request, Response } from 'express';
import { verifyFirebaseToken } from '../Firebase';
import { setUserRole, setCustomClaims } from '../service/userService'; 
import { sendVerificationEmail } from '../service/authService'; // ודא שהנתיב נכון


export async function setRoleAndClaimsController(req: Request, res: Response) {
  const { uid } = req.params;
  const { role, claims } = req.body as { role?: string; claims?: Record<string, any> };

  if (!role && !claims) {
    return res.status(400).json({ error: 'Missing role and/or claims in body' });
  }

  try {

    if (role) {
      
      await setUserRole(uid, role);
    }
    if (claims && typeof claims === 'object') {
      await setCustomClaims(uid, claims);
    }

    return res.status(200).json({ message: 'User role/claims updated' });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to update role/claims' });
  }
}


export async function verifyTokenController(req: Request, res: Response) {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }
  try {
    const userData = await verifyFirebaseToken(token);
    res.json(userData);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// הגדרת אינטרפייס עבור Request מאומת
// בהנחה ש-middleware האימות שלך מוסיף את פרטי המשתמש ל-req.user
interface AuthenticatedRequest extends Request {
  user?: { uid: string; email?: string; /* ... נתונים נוספים של המשתמש מה-ID Token */ };
}

export async function sendVerificationEmailController(req: AuthenticatedRequest, res: Response) {
  // ודא שהמשתמש מאומת וה-UID שלו זמין (זה צריך לקרות ב-middleware)
  const uid = req.user?.uid;
  if (!uid) {
    return res.status(401).json({ message: 'Unauthorized: User UID not found in request.' });
  }

  try {
    const result = await sendVerificationEmail(uid);
    res.status(200).json(result); // שלח תגובת הצלחה ללקוח
  } catch (error: any) {
    console.error("Error in sendVerificationEmailController:", error);
    res.status(500).json({ message: error.message || 'Internal server error during email verification request.' });
  }
}
