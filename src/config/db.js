import pg from "pg";
// import logger from "../logger/logger.js";

const pool = new pg.Pool({
    user: "postgres",
    password: "sanyog",
    host: "localhost",
    port: "5432",
    database: "reel_dump_dev",
});

// const connectDB = async () => {
//     try {
//         const con = mysql.createConnection({
//             host: "localhost",
//             user: "root",
//             password: "sanyog",
//         });
//         const connection = con.connect();
//         logger.info(`Connected to DB ${connection}`);
//     } catch (err) {
//         logger.error(err);
//         process.exit(1);
//     }
// };

export default pool;
