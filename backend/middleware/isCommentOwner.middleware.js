import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Blog } from "../models/Blog.model.js";

export const isCommentOwner = asyncHandler(async(req , res, next)=>{
      const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to perform this action"
        );
    }

    // Make the comment available to the next middleware/controller
    req.comment = comment;

    next();
})