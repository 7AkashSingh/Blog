import { Follow } from "../models/Follow.model.js";
import { Blog } from "../models/Blog.model.js";

import ApiError from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getFeed = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    // Step 1: find people user follows
    const following = await Follow.find({
        follower: userId,
    }).select("following");

    const followingIds = following.map(
        (f) => f.following
    );

    // Step 2: get blogs from those users
    const blogs = await Blog.find({
        author: { $in: followingIds },
        status: "published",
    })
        .populate("author", "username avatar")
        .populate("category", "name slug")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            blogs,
            "Feed fetched successfully"
        )
    );
});

export { getFeed };