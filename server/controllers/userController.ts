import { NextFunction, Request, Response } from 'express';
import { getUserProfile ,setUserRole ,createOrUpdateUser, deleteUserService} from '../service/userService';


// טיפול בבקשה ליצירה או עדכון משתמש
async function handleUserUpsert(req: Request, res: Response) {
  const { uid, email, full_name, photo_url, phone } = req.body || {};

  try {

    const user = await createOrUpdateUser(uid, email, full_name, photo_url, phone);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in handleUserUpsert:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// קבלת פרופיל משתמש לפי Uid
const getUserProfileController = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params;
  
  try {
    const userProfile = await getUserProfile(uid);
    if (userProfile) {
      res.status(200).json(userProfile);
    }
    else {
      res.status(404).json({ message: 'User not found' });
    }
  }
  catch (error) {
    console.error('Error in getUserProfileController:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller לעדכון פרופיל משתמש
// const updateUserController = async (req: Request, res: Response): Promise<void> => {
//   const { uid } = req.params;
//   const { user } = req.body;
//   try {
//     const userProfile = await updateUser(uid, user);
//     if (userProfile) {
//       res.status(200).json(userProfile);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error in getUserProfileController:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// שינוי תפקיד משתמש ועדכון טענות מותאמות אישית ב-Firebase
async function setRoleAndClaimsController(req: Request, res: Response) {
  try {
    const { targetUid, newRole } = req.body;
    if (!targetUid || !newRole) {
      return res.status(400).json({ error: 'Missing targetUid or newRole' });
    }
    await setUserRole(targetUid, newRole);
    res.status(200).json({ message: `Role for user ${targetUid} updated to ${newRole}` });
  } catch (error: any) {
    console.error('Error in changeUserRoleController:', error);
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
  }
}

export async function deleteUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    const deleted = await deleteUserService(userId);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export { getUserProfileController, handleUserUpsert, setRoleAndClaimsController };
