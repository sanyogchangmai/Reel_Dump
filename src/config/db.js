import pg from "pg";
// import logger from "../logger/logger.js";

const pool = new pg.Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
});

export default pool;
