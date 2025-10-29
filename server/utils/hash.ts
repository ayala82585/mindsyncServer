import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// פונקציה שמקבלת סיסמה גולמית ומחזירה hash
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// פונקציה שמשווה בין סיסמה רגילה ל־hash
export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}