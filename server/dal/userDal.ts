
import { User } from '../models/User';
import admin from 'firebase-admin';
import database from '../database';

class UserDAL {

  private pool = database.getPool();

  // הוספה או עדכון משתמש מבוסס Firebase
  public async upsertUserFromFirebase(uid: string, userData: User): Promise<User | null> {
    try {
      const updated = this.updateUser(uid, userData);
      if (updated)
        return updated;
      else {
        const result = await database.getPool().query('INSERT INTO users (uid, email, full_name, photo_url, role) VALUES (\$1, \$2, \$3, \$4, \$5) RETURNING *', [uid, userData.email, userData.full_name, userData.photo_url, "user"]);
        if (!result.rows || result.rows.length === 0) {
          throw new Error('Failed to insert user');
        }
        return result.rows[0];
      }
    } catch (error) {
      console.error("Error in upsertUserFromFirebase:", error);
      throw error;
    }
  }

  // אימות UID מול Firebase
  public async verifyUid(uid: string): Promise<boolean> {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord != null;
    } catch (error) {
      console.error("UID verification failed:", error);
      return false;
    }
  }

  // קבלת משתמש לפי UID
  public async getUserByUid(uid: string): Promise<User | null> {
    const isValidUid = await this.verifyUid(uid);
    if (!isValidUid) {
      throw new Error('Invalid UID');
    }
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE uid = $1', [uid]);
      if (!result.rows || result.rows.length === 0) {
        throw new Error('User not found');
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // עדכון פרטי משתמש
  public async updateUser(uid: string, userData: User): Promise<User | null> {
    const isValidUid = await this.verifyUid(uid);
    if (!isValidUid) {
      throw new Error('Invalid UID');
    }
    try {
      const result = await this.pool.query('UPDATE users SET email = $1, full_name = $2, photo_url = $3 WHERE uid = $4 RETURNING *', [userData.email, userData.full_name, userData.photo_url, uid]);
      if (!result.rows || result.rows.length === 0) {
        throw new Error('User not found');
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // עדכון תפקיד משתמש
  public async updateUserRole(uid: string, role: string): Promise<void> {
    try {
      const sql = 'UPDATE users SET role = $1, updated_at = NOW() WHERE uid = $2';
      await this.pool.query(sql, [role, uid]);
    }
    catch (error) {
      console.error('Failed to update user role in DB:', error);
      throw error;
    }
  }

  // קבלת סטטוס אימות אימייל
  public async getVerifyFlag(uid: string): Promise<boolean | null> {
    const sql = 'SELECT is_verified FROM users WHERE uid = $1';
    const { rows } = await this.pool.query(sql, [uid]);
    if (!rows.length)
      throw new Error('User not found');
    return !!rows[0].is_verified;
  }

  // סימון משתמש כאומת
  public async setVerified(uid: string): Promise<void> {
    const sql = 'UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE uid = $1';
    await this.pool.query(sql, [uid]);
  }

  // הורדת קרדיטים מחשבון המשתמש
 public decrementCredits = async (userId: string, amount: number) => {
    const sql = `
      UPDATE users
      SET aiSessionCredits = aiSessionCredits - $1,
          updated_at = NOW()
      WHERE id = $2 AND aiSessionCredits >= $1
      RETURNING *`;
    const { rows } = await this.pool.query(sql, [amount, userId]);
    if (rows.length === 0) throw new Error("אין קרדיטים זמינים");
    return rows[0];
  };

}
export default UserDAL;