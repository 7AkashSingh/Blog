import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { Blog } from "../models/Blog.model.js";
import { Follow } from "../models/Follow.model.js";
import { Like } from "../models/Likes.model.js";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId);
    
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
    
        await user.save({
            validateBeforeSave: false,
        });
    
        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.log(error);
        throw new ApiError(
            500,
           
            "Something went wrong while generating access and refresh tokens"
        );
    }
};

const registerUser = asyncHandler(async(req, res)=>{
    const { username, email, password } = req.body;

    if (
        [username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    })

    if (existedUser) {
        throw new ApiError(
            409,
            "User already exists"
        );
    }

    const user = await User.create({
        username,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );

});

const loginUser  = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new ApiError(
            400,
             "Email and password are required"
        )
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(
            404,
            "User does not exist"
        );
    }

    const isPasswordCorrect =
       await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(
                    401,
                    "Invalid credentials"
        );
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(
        user._id
    ).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };  
    
   return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {

    const { username, bio } = req.body;

    const updates = {};

    if (username) updates.username = username;
    if (bio) updates.bio = bio;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Profile updated successfully"
        )
    );
});



const changeCurrentPassword = asyncHandler(async (req, res) => {

    const {
        oldPassword,
        newPassword,
    } = req.body;

    const user = await User.findById(req.user._id);

    const isPasswordCorrect =
        await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {

    if (!req.file?.path) {
        throw new ApiError(400, "Avatar is required");
    }

    const uploadedAvatar =
        await uploadOnCloudinary(req.file.path);

    const user = await User.findById(req.user._id);

    if (user.avatarPublicId) {
        await deleteFromCloudinary(user.avatarPublicId);
    }

    user.avatar = uploadedAvatar.secure_url;
    user.avatarPublicId = uploadedAvatar.public_id;

    await user.save({
        validateBeforeSave: false,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Avatar updated successfully"
        )
    );
});


const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    // 1. Find the user
    const user = await User.findOne({
        username: username.toLowerCase(),
    }).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 2. Run independent queries in parallel
    const [
        totalBlogs,
        followersCount,
        followingCount,
        likesResult,
        viewsResult,
    ] = await Promise.all([

        // Published blogs count
        Blog.countDocuments({
            author: user._id,
            status: "published",
        }),

        // Followers
        Follow.countDocuments({
            following: user._id,
        }),

        // Following
        Follow.countDocuments({
            follower: user._id,
        }),

        // Total Likes
        Blog.aggregate([
            {
                $match: {
                    author: user._id,
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

        // Total Views
        Blog.aggregate([
            {
                $match: {
                    author: user._id,
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
    ]);

    // 3. Extract aggregation results
    const totalLikes =
        likesResult.length > 0
            ? likesResult[0].totalLikes
            : 0;

    const totalViews =
        viewsResult.length > 0
            ? viewsResult[0].totalViews
            : 0;

    // 4. Check if current user follows this profile
    let isFollowing = false;

    if (
        req.user &&
        req.user._id.toString() !== user._id.toString()
    ) {
        isFollowing = !!(await Follow.exists({
            follower: req.user._id,
            following: user._id,
        }));
    }

    // 5. Return profile
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user,
                stats: {
                    totalBlogs,
                    followers: followersCount,
                    following: followingCount,
                    totalLikes,
                    totalViews,
                    isFollowing,
                },
            },
            "Profile fetched successfully"
        )
    );
});

const getMyBlogs = asyncHandler(async (req, res) => {

    const blogs = await Blog.find({
        author: req.user._id,
    })
        .populate("category", "name")
        .sort({
            createdAt: -1,
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            blogs,
            "Blogs fetched successfully"
        )
    );
});

import jwt from "jsonwebtoken";

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token expired");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken,
                    },
                    "Access token refreshed successfully"
                )
            );

    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

const getUserBlogs = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({
        username: username.toLowerCase(),
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const blogs = await Blog.find({
        author: user._id,
        status: "published",
    })
        .populate("category", "name")
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
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    generateAccessAndRefreshTokens,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    getUserProfile,
    getMyBlogs,
    getUserBlogs
};