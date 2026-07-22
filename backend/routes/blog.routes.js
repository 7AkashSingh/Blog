import { Router } from "express";

import {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    searchBlogs,
    getTrendingBlogs,
    getRelatedBlogs,
    getLatestBlogs,
    getBlogsByCategory,
    getBlogsByTag,
    getMyBlogs,
    getBlogById,
} from "../controllers/blog.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { isBlogOwner } from "../middleware/isBlogOwner.middleware.js";
import { upload } from "../middleware/multre.middleware.js";

const router = Router();


router.get("/", getAllBlogs);

router.get("/search", searchBlogs);

router.get("/trending", getTrendingBlogs);

router.get("/latest", getLatestBlogs);

router.get("/my/blogs", verifyJWT, getMyBlogs);

router.get("/id/:id", verifyJWT, getBlogById);

router.get("/category/:slug", getBlogsByCategory);

router.get("/tag/:tag", getBlogsByTag);

router.get("/:slug/related", getRelatedBlogs);

router.get("/:slug", getBlogBySlug);

router.post(
    "/",
    verifyJWT,
    upload.single("coverImage"),
    createBlog
);

router.patch(
    "/:id",
    verifyJWT,
    isBlogOwner,
    upload.single("coverImage"),
    updateBlog
);

router.delete(
    "/:id",
    verifyJWT,
    isBlogOwner,
    deleteBlog
);

export default router;