import { Pool } from 'pg';

class Database {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.user,
            host: process.env.host,
            database: process.env.database,
            password: process.env.password,
            // port: process.env.port,
            port: 5432,
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 30000,
            // max: process.env.max,

        });
    }

    public getPool(): Pool {
        return this.pool;
    }
}

export default new Database();



