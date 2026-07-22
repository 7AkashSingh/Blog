import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    getBlogComments,
    createComment,
    updateComment,
    deleteComment,
} from "../../services/commentServices.js";

// ================= FETCH COMMENTS =================

export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (blogId, thunkAPI) => {
        try {
            const response = await getBlogComments(blogId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ================= CREATE COMMENT =================

export const createNewComment = createAsyncThunk(
    "comments/createComment",
    async ({ blogId, content }, thunkAPI) => {
        try {
            const response = await createComment(blogId, content);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ================= UPDATE COMMENT =================

export const updateExistingComment = createAsyncThunk(
    "comments/updateComment",
    async ({ commentId, content }, thunkAPI) => {
        try {
            const response = await updateComment(commentId, content);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ================= DELETE COMMENT =================

export const deleteExistingComment = createAsyncThunk(
    "comments/deleteComment",
    async (commentId, thunkAPI) => {
        try {
            const response = await deleteComment(commentId);

            return {
                commentId,
                ...response,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ================= INITIAL STATE =================

const initialState = {
    comments: [],
    loading: false,
    error: null,
};

// ================= SLICE =================

const commentSlice = createSlice({
    name: "comments",
    initialState,

    reducers: {
        clearCommentError: (state) => {
            state.error = null;
        },

        clearComments: (state) => {
            state.comments = [];
        },
    },

    extraReducers: (builder) => {
        builder

            // FETCH COMMENTS

            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload.data || [];
            })

            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE COMMENT

            .addCase(createNewComment.pending, (state) => {
                state.loading = true;
            })

            .addCase(createNewComment.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.data) {
                    state.comments.push(action.payload.data);
                }
            })

            .addCase(createNewComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE COMMENT

            .addCase(updateExistingComment.pending, (state) => {
                state.loading = true;
            })

            .addCase(updateExistingComment.fulfilled,(state,action)=>{
                const updatedComment = action.payload.data;
                const index = state.comments.findIndex(
                    (comment)=>comment._id === updatedComment._id
                );
                if(index !== -1){
                    state.comments[index] = updatedComment;
                }
            })

            .addCase(updateExistingComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE COMMENT

            .addCase(deleteExistingComment.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteExistingComment.fulfilled,(state,action)=>{
                const deletedId = action.meta.arg;
                state.comments = state.comments.filter(
                    (comment)=>comment._id !== deletedId
                );
            })

            .addCase(deleteExistingComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCommentError,
    clearComments,
} = commentSlice.actions;

export default commentSlice.reducer;