
// import { Pool } from 'pg'; // import as a value
// import { User } from '../models/User'; // import the User interface

// // מחלקת UserDAL
// export class UserDAL {
//   private pool: Pool;

//   constructor() {
//     this.pool = new Pool({
//       user: 'postgres',
//       host: 'localhost',
//       database: 'postgres',
//       password: '1111',
//       port: 5432,
//     });
//   }

//   // הפונקציה getUserByUid
//   public async getUserByUid(uid: string): Promise<User | null> {
//     try {
//       const result = await this.pool.query('SELECT * FROM users WHERE uid = $1', [uid]);

//       // אם אין שורות בתוצאה, החזר null
//       if (!result.rows || result.rows.length === 0) {
//         return null;
//       }

//       // אם יש שורות, החזר את השורה הראשונה
//       return result.rows[0];
//     } catch (error) {
//       throw error;
//     }
//   }


// public async updateUser(uid: string, userData: User): Promise<User | null> {
//   try {
//     const result = await this.pool.query('UPDATE users SET email = $1, full_name = $2, photo_url = $3 WHERE uid = $4 RETURNING *', [userData.email, userData.full_name, userData.photo_url, uid]);
//     console.log('Update result:', result); // Debugging line to check the result of the update query
//     // אם אין שורות בתוצאה, החזר null
//       if (!result.rows || result.rows.length === 0) {
//         return null;
//       }

//       // אם יש שורות, החזר את השורה הראשונה
//       return result.rows[0];
//     } catch (error) {
//       throw error;
//     }
//   }

// }
// // ייצוא ברירת מחדל של המחלקה
// export default UserDAL;


import { User } from '../models/User'; // import the User interface
import database from '../database'; // ייבוא של מופע ה-Database



// מחלקת UserDAL
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
        throw error;
    }
}
    // הפונקציה getUserByUid
    public async getUserByUid(uid: string): Promise<User | null> {
        try {
            const result = await database.getPool().query('SELECT * FROM users WHERE uid = \$1', [uid]);

            // אם אין שורות בתוצאה, החזר null
            if (!result.rows || result.rows.length === 0) {
                return null;
            }

            // אם יש שורות, החזר את השורה הראשונה
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    public async updateUser(uid: string, userData: User): Promise<User | null> {
        try {
            const result = await database.getPool().query('UPDATE users SET email = \$1, full_name = \$2, photo_url = \$3 WHERE uid = \$4 RETURNING *', [userData.email, userData.full_name, userData.photo_url, uid]);
            console.log('Update result:', result); // Debugging line to check the result of the update query

            // אם אין שורות בתוצאה, החזר null
            if (!result.rows || result.rows.length === 0) {
                return null;
            }

            // אם יש שורות, החזר את השורה הראשונה
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

// ייצוא ברירת מחדל של המחלקה
export default UserDAL;