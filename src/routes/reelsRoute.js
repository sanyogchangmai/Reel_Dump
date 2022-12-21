import express from "express";
import {
    saveReel,
    getCategory,
    getReelsByCategory,
    updateCategory,
    updateName,
} from "../controllers/reelsController.js";
const reelsRouter = express.Router();
import protect from "../middlewares/authMiddleware.js";

reelsRouter.post("/save", protect, saveReel);
reelsRouter.get("/category/:uid", protect, getCategory);
reelsRouter.get("/category/:category/:uid", protect, getReelsByCategory);
reelsRouter.patch("/update/category/:rid", protect, updateCategory);
reelsRouter.patch("/update/name/:rid", protect, updateName);

export default reelsRouter;
