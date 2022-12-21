import pool from "../config/db.js";
import logger from "../logger/logger.js";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import axios from "axios";

// * @desc - SAVE REEL DATA CONTROLLER
// * @method - POST
// * @route - /reels/save
const saveReel = async (req, res) => {
    const payload = req.body;

    // * Web scaping
    const url = payload.reel_link;
    let thumbnail;
    let name;
    try {
        const response = await axios.get(url, {
            headers: {"Accept-Encoding": "gzip,deflate,compress"},
        });
        const markup = response.data;
        const $ = cheerio.load(markup);
        thumbnail = $("head meta[name=twitter:image]").attr("content");
        if (!payload.name) {
            const title = $("title").html();
            name = title.substring(0, 50);
        } else {
            name = payload.name;
        }
    } catch (err) {
        logger.error(err.stack);
        logger.debug(err);
    }

    const query =
        "INSERT INTO reels (uid, reel_link, thumbnail, name, category) values ($1, $2, $3, $4, $5)";
    const values = [
        payload.uid,
        payload.reel_link,
        thumbnail,
        name,
        payload.category,
    ];

    try {
        const reel = await pool.query(query, values);
        res.status(201).json({
            status: "success",
            code: 201,
            message: "Data saved successfully.",
        });
    } catch (err) {
        logger.error("Error occured during saving reel data.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to save data. Try again.",
            data: err,
        });
    }
};

// * @desc - REEL CATEGORY CONTROLLER
// * @method - GET
// * @route - /reels/category/:uid
const getCategory = async (req, res) => {
    const uid = req.params.uid;
    const query = "SELECT DISTINCT category FROM reels where uid = $1";
    const values = [uid];
    try {
        const result = await pool.query(query, values);
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Categories fetched successfully.",
            data: result.rows,
        });
    } catch (err) {
        logger.error("Error occured while fetching category data.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to fetch categories. Try again.",
            data: err,
        });
    }
};

// * @desc - REEL BY CATEGORY CONTROLLER
// * @method - GET
// * @route - /reels/category/:category/:uid
const getReelsByCategory = async (req, res) => {
    const uid = req.params.uid;
    const category = req.params.category;
    const query = "SELECT * from reels where (uid = $1 AND category = $2)";
    const values = [uid, category];
    try {
        const result = await pool.query(query, values);
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Data fetched successfully.",
            data: result.rows,
        });
    } catch (err) {
        logger.error("Error occured while fetching reels data.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed to fetch reels. Try again.",
            data: err,
        });
    }
};

// * @desc - UPDATE REEL CATEGORY CONTROLLER
// * @method - PATCH
// * @route - /reels/update/category/:rid
const updateCategory = async (req, res) => {
    const rid = req.params.rid;
    const category = req.body.category;
    const query = "UPDATE reels SET category = $1 WHERE rid = $2";
    const values = [category, rid];

    try {
        const result = await pool.query(query, values);
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Reel moved successfully.",
            data: result.rows,
        });
    } catch (err) {
        logger.error("Error occured while updating category.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed update category. Try again.",
            data: err,
        });
    }
};

// * @desc - UPDATE REEL NAME CONTROLLER
// * @method - PATCH
// * @route - /reels/update/name/:rid
const updateName = async (req, res) => {
    const rid = req.params.rid;
    const name = req.body.name;
    const query = "UPDATE reels SET name = $1 WHERE rid = $2";
    const values = [name, rid];

    try {
        const result = await pool.query(query, values);
        res.status(200).json({
            status: "success",
            code: 200,
            message: "Name updated successfully.",
            data: result.rows,
        });
    } catch (err) {
        logger.error("Error occured while updating name.");
        logger.error(err);
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Failed update name. Try again.",
            data: err,
        });
    }
};

export {saveReel, getCategory, getReelsByCategory, updateCategory, updateName};
