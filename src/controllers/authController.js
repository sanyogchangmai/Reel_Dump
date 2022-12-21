import pool from "../config/db.js";
import logger from "../logger/logger.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// * @desc - SIGNUP CONTROLLER
// * @method - POST
// * @route - /auth/signup
const signUpUser = async (req, res) => {
    const {email, password} = req.body;

    // ! handle missing data
    if (!email || !password) {
        logger.info("Missing data. All data not provided during signup.");
        res.status(400).json({
            status: "error",
            code: 400,
            message: "Data missing, please provide all fields.",
        });
    }

    // ! check if user already exists
    const user = await pool.query("SELECT * FROM users where email = $1", [
        email,
    ]);
    if (user.rowCount !== 0) {
        res.status(409).json({
            status: "error",
            code: 409,
            message: "User already exists.",
        });
    } else {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const query = "INSERT INTO users (email, password) values ($1, $2)";
            const values = [email, hashPassword];
            const newUser = await pool.query(query, values);
            console.log(newUser);
            res.status(201).json({
                status: "success",
                code: 201,
                message: "User account created successfully.",
                data: newUser.rows,
            });
        } catch (err) {
            logger.error("Error occured during signup.");
            logger.error(err);
            res.status(500).json({
                status: "error",
                code: 500,
                message: "Failed to create user account. Try again.",
                data: err,
            });
        }
    }
};

// * @desc - LOGIN CONTROLLER
// * @method - POST
// * @route - /auth/login
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        logger.info("Missing data. All data not provided during login.");
        res.status(400).json({
            status: "error",
            message: "Data missing, please provide all fields.",
        });
    }

    // ! check if user exists
    const user = await await pool.query(
        "SELECT * FROM users where email = $1",
        [email]
    );

    if (user.rowCount > 0) {
        // ! check if password matches
        if (bcrypt.compareSync(password, user.rows[0].password) == true) {
            logger.info("User password match.");
            const token = generateToken(user.rows[0].uid);
            res.status(200).json({
                status: "success",
                code: 200,
                message: "User authenticated successfully.",
                data: {
                    uid: user.rows[0].uid,
                    email: user.rows[0].email,
                    access_token: token,
                },
            });
        } else {
            logger.info("Password do not match.");
            res.status(401).json({
                status: "error",
                code: 401,
                message: "Wrong password.",
            });
        }
    } else {
        logger.info("No user found with this email.");
        res.status(404).json({
            status: "error",
            message: "No user found with this email.",
        });
    }
};

// * @desc - USER DATA CONTROLLER
// * @method - GET
// * @route - /auth/user/data
const getUser = async (req, res) => {
    const userId = req.body.uid;

    try {
        const query = "SELECT * FROM users where uid = $1";
        const values = [userId];
        const user = await pool.query(query, values);
        if (user) {
            logger.info("User data fetched successfully");
            res.status(200).json({
                status: "success",
                code: 200,
                message: "User data fetched successfully.",
                data: {
                    uid: user.rows[0].uid,
                    email: user.rows[0].email,
                },
            });
        } else {
            logger.info("No user found with this id.");
            res.status(404).json({
                status: "error",
                code: 404,
                message: "No user found with this id.",
            });
        }
    } catch (err) {
        logger.error("Failed to fetch user data.");
        logger.error(err.stack);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to fetch user data.",
        });
    }
};

// ! ---------- FUNCTIONS ----------
// * Generate JWT token
const generateToken = (uid) => {
    console.log("fun" + uid);
    return jwt.sign({uid}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

export {signUpUser, loginUser, getUser};
