import dotenv from "dotenv";
import pg from "pg";
const Pool = pg.Pool;

dotenv.config(); // Load environment variables from a .env file

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ? process.env.DB_PORT : "5432"),
});

export default pool;
