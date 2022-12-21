import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import pool from "../config/db.js";
import logger from "../logger/logger.js";

const protect = asyncHandler(async (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // * Get token from header
        const token = req.headers.authorization.split(" ")[1];

        // * Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // * Get user from token
        try {
            const query = "SELECT * FROM users where uid = $1";
            const values = [decoded.uid];
            const response = await pool.query(query, values);
            if (response) {
                const data = {
                    uid: response.rows[0].uid,
                    email: response.rows[0].email,
                };
                req.user = data;
                next();
            }
        } catch (err) {
            logger.info("Error occured while finding user using access token.");
            logger.debug(err);
            res.status(500).json({
                status: "error",
                code: 500,
                message: "Failed to verify user.",
            });
        }

        // User.findById({_id: decoded.id})
        //     .select("-password")
        //     .then((response) => {
        //         req.user = response;
        //         next();
        //     })
        //     .catch((err) => {
        //         logger.info(
        //             "Error occured while finding user using access token."
        //         );
        //         logger.debug(err);
        //         res.status(500).json({
        //             status: "error",
        //             code: 500,
        //             message: "Failed to verify user.",
        //         });
        //     });
    } else {
        logger.info("Not authorized, access token is missing.");
        res.status(401).json({
            status: "error",
            code: 401,
            message: "Not authorized, access token is missing.",
        });
    }
});

export default protect;
