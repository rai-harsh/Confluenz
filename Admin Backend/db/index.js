import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();

// PostgreSQL configuration
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}) ;
// Connect to the database
db.connect()
    .then(() => console.log("Connected to the PostgreSQL database successfully!"))
    .catch((err) => console.error("Error connecting to the PostgreSQL database:", err.stack));

export default db;
