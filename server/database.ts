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
        });
    }

    public getPool(): Pool {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1111Database pool accessed");
        return this.pool;
    }
}



export default new Database();



