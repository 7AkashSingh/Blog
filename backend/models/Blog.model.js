import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Title is required"],
        trim:true,
        minlength:5,
        maxlength:150
    },
    slug:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: 300,
        default: "",
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    coverImage: {
        url: {
            type: String,
            default: "",
        },
        publicId: {
            type: String,
            default: "",
        },
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
   views: {
        type: Number,
        default: 0,
        min:0
    },

    likesCount: {
        type: Number,
        default: 0,
        min:0
    },

    commentsCount: {
        type: Number,
        default: 0,
        min:0
    },

    readingTime: {
        type: Number,
        default: 0,
        min:0
    },
    },
    {
        timestamps: true,
    }
);

export const Blog = mongoose.model("Blog", blogSchema);

