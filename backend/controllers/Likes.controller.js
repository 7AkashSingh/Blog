import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Blog } from "../models/Blog.model.js";
import { Like } from "../models/Likes.model.js";
import { Notification } from "../models/Notification.model.js";

const toggleLike = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user._id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    const existingLike = await Like.findOne({
        blog: blogId,
        likedBy: userId,
    });
    if (existingLike) {
        await Like.deleteOne({
            _id: existingLike._id,
        });
        const updatedBlog = await Blog.findOneAndUpdate(
            {
                _id: blogId,
                likesCount: { $gt: 0 },
            },
            {
                $inc: {
                    likesCount: -1,
                },
            },
            {
                returnDocument: "after",
            }
        );
         if (
                updatedBlog.author.toString() !== req.user._id.toString()
            ) {

                await Notification.create({
                    recipient: updatedBlog.author,
                    sender: req.user._id,
                    type: "like",
                    blog: updatedBlog._id,
                    message: `${req.user.username} liked your blog`
                });

            }
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    isLiked: false,
                    likesCount: updatedBlog?.likesCount ?? 0,
                },
                "Blog unliked successfully"
            )
        );
    }
    try {
        await Like.create({
            blog: blogId,
            likedBy: userId,
        });
    } catch (error) {
        if (error.code === 11000) {
            const latestBlog = await Blog.findById(blogId);
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        isLiked: true,
                        likesCount: latestBlog.likesCount,
                    },
                    "Already liked"
                )
            );
        }
        throw error;
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $inc: {
                likesCount: 1,
            },
        },
        {
            returnDocument: "after",
        }
    );
    if (blog.author.toString() !== userId.toString()) {
        await Notification.create({
            recipient: blog.author,
            sender: userId,
            type: "like",
            blog: blogId,
            message: "liked your blog",
        });
    }
    return res.status(201).json(
        new ApiResponse(
            201,
            {
                isLiked: true,
                likesCount: updatedBlog.likesCount,
            },
            "Blog liked successfully"
        )
    );
});

const getBlogLikes = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user._id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    const isLiked = await Like.exists({
        blog: blogId,
        likedBy: userId,
    });
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount: blog.likesCount,
                isLiked: !!isLiked,
            },
            "Likes fetched successfully"
        )
    );
});
export {
    toggleLike,
    getBlogLikes,
};