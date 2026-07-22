import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["follow", "like", "comment", "bookmark"],
            required: true,
        },

        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },

        message: {
            type: String,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification = mongoose.model(
    "Notification",
    notificationSchema
);