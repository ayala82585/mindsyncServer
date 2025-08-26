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
        return this.pool;
    }
}



export default new Database();
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


