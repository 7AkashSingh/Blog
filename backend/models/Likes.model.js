import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
            index: true,
        },

        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

likeSchema.index(
    {
        blog: 1,
        likedBy: 1,
    },
    {
        unique: true,
    }
);

likeSchema.index({
    blog: 1,
});

export const Like = mongoose.model("Like", likeSchema);