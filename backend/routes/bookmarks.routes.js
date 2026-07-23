import { Router } from "express";

import {
    toggleBookmark,
    getMyBookmarks,
} from "../controllers/Bookmark.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/:blogId", verifyJWT, toggleBookmark);

router.get("/me", verifyJWT, getMyBookmarks);

export default router;