import { Blog } from "../models/Blog.model.js";
import ApiError from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const isBlogOwner = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    // Allow the author
    if (blog.author.toString() === req.user._id.toString()) {
        req.blog = blog;
        return next();
    }

    // Allow admin
    if (req.user.role === "admin") {
        req.blog = blog;
        return next();
    }

    throw new ApiError(
        403,
        "You are not authorized to perform this action"
    );
});