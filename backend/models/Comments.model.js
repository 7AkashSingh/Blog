import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Comment is required"],
            trim: true,
            maxlength: 1000,
        },

        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
            index: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Comment = mongoose.model("Comment", commentSchema);