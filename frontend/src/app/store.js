import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import blogReducer from "../features/blogs/blogSlice.js";
import categoryReducer from "../features/category/categorySlice.js"
import commentReducer from "../features/comments/commentsSlice.js"
import likeReducer from "../features/likes/likeSlice.js";
import notificationReducer  from "../features/notification/notificationSlice.js"
import profileReducer from "../features/profile/profileSlice.js"
import followReducer from "../features/follow/followSlice.js"
const store = configureStore({
    reducer: {
        auth: authReducer,
        blogs: blogReducer,
        category:categoryReducer,
        comments:commentReducer,
        likes:likeReducer,
        notifications:notificationReducer,
        profile:profileReducer,
        follow:followReducer
    },
});

export default store;