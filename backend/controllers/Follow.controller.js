import ApiError from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";


import { Follow } from "../models/Follow.model.js";
import { User } from "../models/User.model.js";
import { Notification } from "../models/Notification.model.js";

const followUser = asyncHandler(async (req, res) => {

    const { userId } = req.params; // person to follow
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
        throw new ApiError(404, "User not found");
    }

    const existingFollow = await Follow.findOne({
        follower: currentUserId,
        following: userId,
    });

    if (existingFollow) {
        throw new ApiError(400, "Already following this user");
    }

    const follow = await Follow.create({
        follower: currentUserId,
        following: userId,
    });

    await Notification.create({
        recipient: userId,
        sender: currentUserId,
        type: "follow",
        message: "started following you",
    });

    return res.status(201).json(
        new ApiResponse(201, follow, "User followed successfully")
    );
});

const unfollowUser = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    const currentUserId = req.user._id;

    const deleted = await Follow.findOneAndDelete({
        follower: currentUserId,
        following: userId,
    });

    if (!deleted) {
        throw new ApiError(404, "You are not following this user");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Unfollowed successfully")
    );
});


const getFollowers = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const followers = await Follow.find({
        following: userId,
    }).populate("follower", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, followers, "Followers fetched successfully")
    );
});


const getFollowing = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const following = await Follow.find({
        follower: userId,
    }).populate("following", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, following, "Following list fetched successfully")
    );
});

const checkFollowStatus = asyncHandler(async(req,res)=>{

    const { userId } = req.params;

    const currentUserId = req.user._id;


    const isFollowing = await Follow.exists({
        follower: currentUserId,
        following: userId
    });


    return res.status(200).json(
        new ApiResponse(
            200,
            {
                isFollowing: !!isFollowing
            },
            "Follow status fetched"
        )
    );
});


export {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollowStatus
};