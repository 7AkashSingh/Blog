import slugify from "slugify";
import mongoose from "mongoose";
import { Blog } from "../models/Blog.model.js";
import { Category } from "../models/Category.model.js";

import ApiError from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";


import { uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"


// ----------------------------
// Create Blog
// ----------------------------
const createBlog = asyncHandler(async (req, res) => {
    const {
        title,
        excerpt,
        content,
        category,
        tags,
        status,
    } = req.body;

    if (!title || !content || !category) {
        throw new ApiError(400, "Title, content and category are required");
    }

    // Check category exists
   if(!mongoose.Types.ObjectId.isValid(category)){
        throw new ApiError(
            400,
            "Invalid category id"
        );
    }


    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
        throw new ApiError(404, "Category not found");
    }

    let coverImage = {
        url: "",
        publicId: "",
    };

    if (req.file?.path) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);

        if (!uploadedImage) {
            throw new ApiError(
                500,
                "Failed to upload cover image"
            );
        }

        coverImage = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        };
    }

    // Generate unique slug
    let slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    const slugExists = await Blog.findOne({ slug });

    if (slugExists) {
        slug = `${slug}-${Date.now()}`;
    }

    // Calculate reading time
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    const blog = await Blog.create({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author: req.user._id,
        category,
        tags:
        typeof tags === "string"
            ? tags
                .split(",")
                .map((tag)=>tag.trim().toLowerCase())
                .filter(Boolean)
            : Array.isArray(tags)
                ? tags.map((tag)=>tag.trim().toLowerCase())
                : [],
        status: status || "draft",
        readingTime,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            blog,
            "Blog created successfully"
        )
    );
});

// ----------------------------
// Get All Blogs
// ----------------------------
const getAllBlogs = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const blogs = await Blog.find({
        status: "published",
    })
        .populate("author", "username avatar")
        .populate("category", "name")
        .sort({
            createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    const totalBlogs = await Blog.countDocuments({
        status: "published",
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                blogs,
                currentPage: page,
                totalPages: Math.ceil(totalBlogs / limit),
                totalBlogs,
            },
            "Blogs fetched successfully"
        )
    );
});

// ----------------------------
// Get Blog By Slug
// ----------------------------

const getMyBlogs = asyncHandler(async (req, res) => {

    const blogs = await Blog.find({
        author: req.user._id,
    })
        .populate("category", "name slug")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            blogs,
            "My blogs fetched successfully"
        )
    );

});



const getBlogBySlug = asyncHandler(async (req, res) => {

    const { slug } = req.params;
    console.log("Requested slug:", slug);
    const blog = await Blog.findOne({
        slug,
        status: "published",
    })
        .populate("author", "username avatar bio")
        .populate("category", "name");

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    // Increment views
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            blog,
            "Blog fetched successfully"
        )
    );
});

// ----------------------------
// Update Blog
// ----------------------------
const updateBlog = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    if (blog.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this blog");
    }

    const updates = req.body;

    if (req.file?.path) {
        if (blog.coverImage?.publicId) {
            await deleteFromCloudinary(blog.coverImage.publicId);
        }

        const uploadedImage = await uploadOnCloudinary(req.file.path);

        updates.coverImage = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        };
    }

    if (updates.title) {
        updates.slug = slugify(updates.title, {
            lower: true,
            strict: true,
            trim:true
        });

        const existingBlog = await Blog.findOne({
            slug: updates.slug,
            _id: { $ne: id },
        });

        if (existingBlog) {
            updates.slug = `${updates.slug}-${Date.now()}`;
        }
    }

    if (updates.content) {
        const words = updates.content.trim().split(/\s+/).length;
        updates.readingTime = Math.ceil(words / 200);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        updates,
        {
            new: true,
            runValidators: true,
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedBlog,
            "Blog updated successfully"
        )
    );
});

// ----------------------------
// Delete Blog
// ----------------------------
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    if (blog.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this blog");
    }

    if (blog.coverImage.publicId) {
        await deleteFromCloudinary(blog.coverImage.publicId);
    }

    await blog.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            { id },          // 👈 Return deleted id
            "Blog deleted successfully"
        )
    );
});


// ----------------------------
// Search Blogs
// ----------------------------
const searchBlogs = asyncHandler(async (req, res) => {
    const {
        q,
        category,
        tag,
        sort = "latest",
        page = 1,
        limit = 10,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);

    const filter = {
        status: "published",
    };

    // Search by title, content and tags
    if (q?.trim()) {
        filter.$or = [
            {
                title: {
                    $regex: q.trim(),
                    $options: "i",
                },
            },
            {
                content: {
                    $regex: q.trim(),
                    $options: "i",
                },
            },
            {
                tags: {
                    $regex: q.trim(),
                    $options: "i",
                },
            },
        ];
    }

    // Filter by category slug
    if (category?.trim()) {
        const categoryDoc = await Category.findOne({
            slug: category.trim(),
        });

        if (!categoryDoc) {
            throw new ApiError(404, "Category not found");
        }

        filter.category = categoryDoc._id;
    }

    // Filter by tag
    if (tag?.trim()) {
        filter.tags = {
            $in: [tag.trim()],
        };
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
        case "oldest":
            sortOption = { createdAt: 1 };
            break;

        case "popular":
            sortOption = {
                likesCount: -1,
                views: -1,
                createdAt: -1,
            };
            break;

        case "latest":
        default:
            sortOption = { createdAt: -1 };
    }

    const skip = (pageNumber - 1) * limitNumber;

    const blogs = await Blog.find(filter)
        .populate("author", "username avatar")
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);

    const totalBlogs = await Blog.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                blogs,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalBlogs / limitNumber),
                    totalBlogs,
                    hasNextPage: pageNumber < Math.ceil(totalBlogs / limitNumber),
                    hasPrevPage: pageNumber > 1,
                    limit: limitNumber,
                },
            },
            "Blogs fetched successfully."
        )
    );
});
const getTrendingBlogs = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments({
        status: "published",
    });

    const blogs = await Blog.aggregate([
        {
            $match: {
                status: "published",
            },
        },

        // Get likes
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "blog",
                as: "likes",
            },
        },

        // Get comments
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "blog",
                as: "comments",
            },
        },

        // Count likes & comments
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },

                commentsCount: {
                    $size: "$comments",
                },
            },
        },

        // Trending Score
        {
            $addFields: {
                trendingScore: {
                    $add: [
                        "$views",
                        {
                            $multiply: ["$likesCount", 3],
                        },
                        {
                            $multiply: ["$commentsCount", 2],
                        },
                    ],
                },
            },
        },

        // Sort
        {
            $sort: {
                trendingScore: -1,
                createdAt: -1,
            },
        },

        // Pagination
        {
            $skip: skip,
        },

        {
            $limit: limit,
        },

        // Author
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
            },
        },

        {
            $unwind: {
                path: "$author",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Category
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },

        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Final Response
        {
            $project: {
                title: 1,
                slug: 1,
                excerpt: 1,
                coverImage: 1,
                readingTime: 1,
                views: 1,
                createdAt: 1,

                likesCount: 1,
                commentsCount: 1,
                trendingScore: 1,

                "author._id": 1,
                "author.username": 1,
                "author.avatar": 1,

                "category._id": 1,
                "category.name": 1,
                "category.slug": 1,
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                blogs,
                currentPage: page,
                totalPages: Math.ceil(totalBlogs / limit),
                totalBlogs,
            },
            "Trending blogs fetched successfully"
        )
    );
});

const getRelatedBlogs = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    // Find current blog
    const currentBlog = await Blog.findOne({
        slug,
        status: "published",
    });

    if (!currentBlog) {
        throw new ApiError(404, "Blog not found");
    }

    const relatedBlogs = await Blog.find({
        _id: { $ne: currentBlog._id },
        status: "published",
        $or: [
            {
                category: currentBlog.category,
            },
            {
                tags: {
                    $in: currentBlog.tags,
                },
            },
        ],
    })
        .populate("author", "username avatar")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(5);

    return res.status(200).json(
        new ApiResponse(
            200,
            relatedBlogs,
            "Related blogs fetched successfully"
        )
    );
});


const getLatestBlogs = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments({
        status: "published",
    });

    const blogs = await Blog.find({
        status: "published",
    })
        .populate("author", "username avatar")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                blogs,
                currentPage: page,
                totalPages: Math.ceil(totalBlogs / limit),
                totalBlogs,
            },
            "Latest blogs fetched successfully"
        )
    );
});

const getBlogsByCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const category = await Category.findOne({ slug });

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const totalBlogs = await Blog.countDocuments({
        category: category._id,
        status: "published",
    });

    const blogs = await Blog.find({
        category: category._id,
        status: "published",
    })
        .populate("author", "username avatar")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                category,
                blogs,
                currentPage: page,
                totalPages: Math.ceil(totalBlogs / limit),
                totalBlogs,
            },
            "Blogs fetched successfully"
        )
    );
});

const getBlogsByTag = asyncHandler(async (req, res) => {
    const { tag } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments({
        tags: tag,
        status: "published",
    });

    const blogs = await Blog.find({
        tags: tag,
        status: "published",
    })
        .populate("author", "username avatar")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                tag,
                blogs,
                currentPage: page,
                totalPages: Math.ceil(totalBlogs / limit),
                totalBlogs,
            },
            "Blogs fetched successfully"
        )
    );
});

const getBlogById = asyncHandler(async (req, res) => {

    const blog = await Blog.findById(req.params.id)
        .populate("category", "name")
        .populate("author", "username avatar");

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            blog,
            "Blog fetched successfully"
        )
    );

});

const getUserBlogs = asyncHandler(async (req, res) => {

    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const blogs = await Blog.find({
        author: user._id,
    })
        .populate("category", "name slug")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            blogs,
            "User blogs fetched successfully"
        )
    );

});

export {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    searchBlogs,
    getTrendingBlogs,
    getRelatedBlogs,
    getLatestBlogs,
    getBlogsByCategory,
    getBlogsByTag ,
    getMyBlogs,
    getBlogById,
    getUserBlogs
};