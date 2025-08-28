
import { Request, Response } from 'express';
import { verifyFirebaseToken } from '../Firebase';
import { checkAndSyncEmailVerified } from '../service/authService';
import { createOrUpdateUser} from '../service/userService'; 
import { setUserRole, setCustomClaims } from '../service/authService';
 

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
  }}

export async function syncUserFromTokenController(req: Request, res: Response) {
  const { token } = req.body as { token?: string };
  if (!token) return res.status(400).json({ error: 'Missing token' });

  try {
    const decoded = await verifyFirebaseToken(token);
    const uid = decoded.uid;
    const email = decoded.email || '';
    const profile = {
      displayName: (decoded as any).name as string | undefined,
      photoURL: (decoded as any).picture as string | undefined,
    };

    const user = await createOrUpdateUser(uid, email, profile);
    if (!user) return res.status(500).json({ error: 'Failed to upsert user' });

    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(401).json({ error: err?.message || 'Invalid token' });
  }
}

export async function verifyEmailStatusController(req: Request, res: Response) {
  const { uid } = req.params; // או מ-req.user.uid אם את מאמתת עם המידלוור
  if (!uid) return res.status(400).json({ error: 'Missing uid' });
  try {
    const result = await checkAndSyncEmailVerified(uid);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'verify email failed' });
  }
}

