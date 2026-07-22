import { Router } from "express";
import mongoose from "mongoose";

import {
    toggleLike,
    getBlogLikes,
} from "../controllers/Likes.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Validate Blog ID
router.param("blogId", (req, res, next, blogId) => {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Blog ID",
        });
    }

    next();
});

// Toggle Like / Unlike
router.post(
    "/:blogId",
    verifyJWT,
    toggleLike
);

// Get Likes Count + User Like Status
router.get(
    "/:blogId",
    verifyJWT,
    getBlogLikes
);

export default router;