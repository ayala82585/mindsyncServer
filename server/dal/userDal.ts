
import { Pool } from 'pg'; 
import { User } from '../models/User';
import admin from 'firebase-admin'; 

export class UserDAL {

  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: '1111',
      port: 5432,
    });
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
    const result = await this.pool.query('UPDATE users SET email = $1, full_name = $2, photo_url = $3 WHERE uid = $4 RETURNING *', [userData.email, userData.full_name, userData.photo_url, uid]);
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
