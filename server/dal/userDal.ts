
// מחלקת UserDAL
import { Pool } from 'pg'; 
import { User } from '../models/User';
import admin from 'firebase-admin'; 
import database from '../database'; // ייבוא של מופע ה-Database
import { Request, Response } from 'express';

export class UserDAL {

    private pool = database.getPool(); // חיבור למסד נתונים

  public async upsertUserFromFirebase(uid: string, userData: User): Promise<User | null> {
    try {
        const existingUser = await this.getUserByUid(uid);
        
        if (existingUser) {
            // אם המשתמש קיים, עדכן את הפרטים
            return await this.updateUser(uid, userData);
        } else {
            // אם המשתמש לא קיים, הוסף אותו
            const result = await database.getPool().query('INSERT INTO users (uid, email, full_name, photo_url) VALUES (\$1, \$2, \$3, \$4) RETURNING *', [uid, userData.email, userData.full_name, userData.photo_url]);
            if (!result.rows || result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
    } catch (error) {
        return null;
    }
}

public async verifyUid(uid: string): Promise<boolean> {
    try {
      const userRecord = await admin.auth().getUser(uid); 
      return userRecord != null; 
    } catch (error) {
      console.error("UID verification failed:", error);
      return false; 
    }
  }

  public async getUserByUid(uid: string): Promise<User | null> {
    const isValidUid = await this.verifyUid(uid); 
    if (!isValidUid) {
      return null; 
    }
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE uid = $1', [uid]);
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
        throw error;
    }
  }

public async updateUser(uid: string, userData: User): Promise<User | null> {
  const isValidUid = await this.verifyUid(uid); 
    if (!isValidUid) {
      return null; 
    }
  try {
    const result = await this.pool.query('UPDATE users SET email = $1, full_name = $2, photo_url = $3, role = $4 WHERE uid = $5 RETURNING *', [userData.email, userData.full_name, userData.photo_url, userData.role, uid]);
    console.log('Update');
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

}

export default UserDAL;
