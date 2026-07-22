import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


import { Comment } from "../models/Comments.model.js";
import { Blog } from "../models/Blog.model.js";
import { Notification } from "../models/Notification.model.js";


const createComment = asyncHandler( async(req , res)=>{
    const { blogId } = req.params
    const { content} = req.body

    if(!content?.trim()){
         throw new ApiError(
            400, 
            "Comment content is requied"
        )
    }
    const blog = await Blog.findById(blogId);
    if(!blog){
        throw new ApiError(
            404, 
            "Not found the blog"
        )
    }
    const comment = await Comment.create({
        content,
        blog: blogId,
        author: req.user._id,
    })

    await Blog.findByIdAndUpdate(
        blogId,
        {
            $inc: {
                commentsCount: 1,
            },
        }
    );
    const populatedComment = await Comment.findById(comment._id)
        .populate("author", "username avatar");

    
    await Notification.create({
        recipient: blog.author,
        sender: req.user._id,
        type: "comment",
        blog: blog._id,
        message: "commented on your blog",
    });

    return res.status(201).json(
        new ApiResponse(
        201,
        populatedComment,
        "Comment created"
        )
    )
})
 

const getBlogComments = asyncHandler(async(req , res)=>{
    const {blogId} = req.params;

    const blog = await Blog.findById(blogId);

    if(!blog){
        throw new ApiError(404, "Blog not found")
    }

    const comments = await Comment.find({
        blog:blogId,
    }).populate("author", "username avatar")
      .sort({ createdAt: 1});

    
    return res.status(200).json(
        new ApiResponse(
            200, 
            comments,
            "Commnets fetched successfully"
        )
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to update this comment"
        );
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
        .populate("author","username avatar");

   return res.status(200).json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete this comment"
        );
    }

    await Blog.findByIdAndUpdate(
        comment.blog,
        {
            $inc: {
                commentsCount: -1,
            },
        }
    );

    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    );
});

export {
    createComment,
    getBlogComments,
    updateComment,
    deleteComment,
};