import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
    {
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

bookmarkSchema.index(
    { blog: 1, user: 1 },
    { unique: true }
);

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);