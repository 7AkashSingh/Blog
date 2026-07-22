import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    toggleLikeAPI,
    getBlogLikesAPI,
} from "../../services/likeServices";

const initialState = {
    likesCount: 0,
    isLiked: false,
    loading: false,
    error: null,
};

export const fetchLikes = createAsyncThunk(
    "likes/fetchLikes",
    async (blogId, thunkAPI) => {
        try {
            return await getBlogLikesAPI(blogId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const toggleLike = createAsyncThunk(
    "likes/toggleLike",
    async (blogId, thunkAPI) => {
        try {
            return await toggleLikeAPI(blogId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const likeSlice = createSlice({
    name: "likes",
    initialState,

    reducers: {
        resetLikes(state) {
            state.likesCount = 0;
            state.isLiked = false;
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchLikes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchLikes.fulfilled, (state, action) => {
                state.loading = false;
                state.likesCount = action.payload.likesCount;
                state.isLiked = action.payload.isLiked;
            })

            .addCase(fetchLikes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(toggleLike.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(toggleLike.fulfilled, (state, action) => {
                state.loading = false;
                state.likesCount = action.payload.likesCount;
                state.isLiked = action.payload.isLiked;
            })

            .addCase(toggleLike.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetLikes } = likeSlice.actions;

export default likeSlice.reducer;