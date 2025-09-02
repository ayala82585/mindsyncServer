import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config(); // מטעין משתנים סביבתיים מתוך קובץ .env

class Database {
    private pool: Pool;

    constructor() {

        // שימוש במשתנים סביבתיים כדי להחביא סיסמאות ונתונים רגישים
        this.pool = new Pool({
            user: process.env.DB_USER,       // שם המשתמש
            host: process.env.DB_HOST,       // כתובת השרת
            database: process.env.DB_NAME,   // שם בסיס הנתונים
            password: process.env.DB_PASSWORD, // סיסמת המשתמש
            port: parseInt(process.env.DB_PORT || '5432'), // פורט החיבור
        });
    }

    // פונקציה שמחזירה את ה-pool
    public getPool(): Pool {

        return this.pool;
    }
}

// יצירת מופע בודד של החיבור
export default new Database();



// import { Pool } from 'pg';

// class Database {
//     private pool: Pool;

//     constructor() {
//         this.pool = new Pool({
//            user: 'postgres',
//       host: 'localhost',
//       database: 'postgres',
//       password: '1111',
//       port: 5432,
//         });
//     }

//     public getPool(): Pool {
//         return this.pool;
//     }
// }



// export default new Database();
// מחלקת UserDAL
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
// export default new Database();


