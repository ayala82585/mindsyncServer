
import { Router } from 'express';
import { verifyTokenController } from '../controllers/authController';
import { setRoleAndClaimsController } from '../controllers/authController';
import { sendVerificationEmailController } from '../controllers/authController'; // ודא שהנתיב נכון
import { authMiddleware } from '../middleware/auth'; // ודא שהנתיב נכון ושקיים כזה middleware

const router = Router();

router.post('/verify-token', verifyTokenController);
router.post('/admin/users/:uid/role', setRoleAndClaimsController); // ← חדש


// ייבא את ה-middleware של האימות שלך
// (זהו middleware שצריך לאמת את ה-Firebase ID Token שנשלח בבקשה ולמלא את req.user)

router.post('/send-verification-email', authMiddleware, sendVerificationEmailController);

export default router;
