import { Blog } from "../models/Blog.model.js";
import { Like } from "../models/Likes.model.js";
import { Comment } from "../models/Comments.model.js";
import { Bookmark } from "../models/Bookmark.model.js";
import { Follow } from "../models/Follow.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [
        publishedBlogs,
        draftBlogs,
        followers,
        following,
        viewsResult,
        likesResult,
        commentsResult,
        bookmarksResult,
    ] = await Promise.all([
        // Published blogs
        Blog.countDocuments({
            author: userId,
            status: "published",
        }),

        // Draft blogs
        Blog.countDocuments({
            author: userId,
            status: "draft",
        }),

        // Followers
        Follow.countDocuments({
            following: userId,
        }),

        // Following
        Follow.countDocuments({
            follower: userId,
        }),

        // Total Views
        Blog.aggregate([
            {
                $match: {
                    author: userId,
                    status: "published",
                },
            },
            {
                $group: {
                    _id: null,
                    totalViews: {
                        $sum: "$views",
                    },
                },
            },
        ]),

        // Total Likes
        Blog.aggregate([
            {
                $match: {
                    author: userId,
                    status: "published",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "blog",
                    as: "likes",
                },
            },
            {
                $group: {
                    _id: null,
                    totalLikes: {
                        $sum: {
                            $size: "$likes",
                        },
                    },
                },
            },
        ]),

        // Total Comments
        Blog.aggregate([
            {
                $match: {
                    author: userId,
                    status: "published",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "blog",
                    as: "comments",
                },
            },
            {
                $group: {
                    _id: null,
                    totalComments: {
                        $sum: {
                            $size: "$comments",
                        },
                    },
                },
            },
        ]),

        // Total Bookmarks
        Blog.aggregate([
            {
                $match: {
                    author: userId,
                    status: "published",
                },
            },
            {
                $lookup: {
                    from: "bookmarks",
                    localField: "_id",
                    foreignField: "blog",
                    as: "bookmarks",
                },
            },
            {
                $group: {
                    _id: null,
                    totalBookmarks: {
                        $sum: {
                            $size: "$bookmarks",
                        },
                    },
                },
            },
        ]),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                blogs: {
                    published: publishedBlogs,
                    drafts: draftBlogs,
                    total: publishedBlogs + draftBlogs,
                },

                engagement: {
                    views:
                        viewsResult.length > 0
                            ? viewsResult[0].totalViews
                            : 0,

                    likes:
                        likesResult.length > 0
                            ? likesResult[0].totalLikes
                            : 0,

                    comments:
                        commentsResult.length > 0
                            ? commentsResult[0].totalComments
                            : 0,

                    bookmarks:
                        bookmarksResult.length > 0
                            ? bookmarksResult[0].totalBookmarks
                            : 0,
                },

                social: {
                    followers,
                    following,
                },
            },
            "Dashboard fetched successfully"
        )
    );
});

export { getDashboard };