import { Notification } from "../models/Notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError  from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await Notification.find({
        recipient: req.user._id,
    })
    .populate(
        "sender",
        "username avatar"
    )
    .populate(
        "blog",
        "title slug"
    )
    .sort({
        createdAt: -1
    });
    return res.status(200).json(
        new ApiResponse(
            200,
            notifications,
            "Notifications fetched successfully"
        )
    );
});



const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification.findOne({
        _id: id,
        recipient: req.user._id
    });
    if(!notification){
        throw new ApiError(
            404,
            "Notification not found"
        );
    }
    notification.isRead = true;
    await notification.save();
    return res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Marked as read"
        )
    );
});


export {
    getNotifications,
    markAsRead
};