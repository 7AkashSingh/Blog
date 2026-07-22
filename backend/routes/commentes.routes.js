import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isCommentOwner } from "../middleware/isCommentOwner.middleware.js";

import { updateComment, deleteComment, createComment, getBlogComments } from "../controllers/Comments.controller.js";

const router = Router();

// Create Comment
router.post("/:blogId", verifyJWT, createComment);

// Get all comments of a blog
router.get("/:blogId", getBlogComments);

// Update Comment
router.patch(
    "/:commentId",
    verifyJWT,
    isCommentOwner,
    updateComment
);

// Delete Comment
router.delete(
    "/:commentId",
    verifyJWT,
    isCommentOwner,
    deleteComment
);

export default router;