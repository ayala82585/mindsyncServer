import { Pool } from 'pg';

class Database {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: '1111',
      port: 5432,
      connectionTimeoutMillis: 5000, // זמן מקס' לפתיחת חיבור (מילי־שניות)
  idleTimeoutMillis: 30000,      // סגירת חיבור לא פעיל
  max: 20  
        });
    }

    public getPool(): Pool {
        return this.pool;
    }
}



export default new Database();



