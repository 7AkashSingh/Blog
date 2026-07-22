import ApiError from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";


import { Bookmark } from "../models/Bookmark.model.js";
import { Blog } from "../models/Blog.model.js"; 


const toggleBookmark = asyncHandler( async(req , res)=>{
    const {blogId} = req.params;

    const blog = Blog.findById(bolgId)

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const existingBookmark  = await findOne({
        blog: blogId,
        bookmarkedBy: req.user._id,
    })

    let isBookmarked = false;

    if (existingBookmark) {
        await existingBookmark.deleteOne();
    } else {
        await Bookmark.create({
            blog: blogId,
            bookmarkedBy: req.user._id,
        });

        isBookmarked = true;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                isBookmarked
            },
            isBookmarked? "Bookmared successfully": "Bookmarked unmarked Successfully"
        )
    )
})

const getMyBookmarks = asyncHandler(async (req, res) => {

    const bookmarks = await Bookmark.find({
        bookmarkedBy: req.user._id,
    })
        .populate({
            path: "blog",
            populate: [
                {
                    path: "author",
                    select: "username avatar",
                },
                {
                    path: "category",
                    select: "name slug",
                },
            ],
        })
        .sort({ createdAt: -1 });

    const blogs = bookmarks.map((bookmark) => bookmark.blog);

    return res.status(200).json(
        new ApiResponse(
            200,
            blogs,
            "Bookmarks fetched successfully"
        )
    );
});

export{toggleBookmark, getMyBookmarks};


