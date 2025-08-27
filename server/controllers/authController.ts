
import { Request, Response } from 'express';
import { verifyFirebaseToken } from '../Firebase';
import { setUserRole, setCustomClaims } from '../service/userService'; 

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

