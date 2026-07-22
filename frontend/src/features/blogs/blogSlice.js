import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
   getAllBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    getMyBlogs,
    getBlogById,

    searchBlogs,
    getTrendingBlogs,
    getLatestBlogs,
    getRelatedBlogs,
    getBlogsByCategory,
    getBlogsByTag,
} from "../../services/blogServices";


// ========================= Fetch All Blogs =========================

export const fetchBlogs = createAsyncThunk(
    "blogs/fetchBlogs",
    async (_, thunkAPI) => {
        try {
            return await getAllBlogs();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Fetch My Blogs =========================

export const fetchMyBlogs = createAsyncThunk(
    "blogs/fetchMyBlogs",
    async (_, thunkAPI) => {
        try {
            return await getMyBlogs();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Fetch Blog By Slug =========================

export const fetchBlogBySlug = createAsyncThunk(
    "blogs/fetchBlogBySlug",
    async (slug, thunkAPI) => {
        try {
            return await getBlogBySlug(slug);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Fetch Blogs By Category =========================

export const fetchBlogsByCategory = createAsyncThunk(
    "blogs/fetchBlogsCategory",
    async (category, thunkAPI) => {
        try {
            return await getBlogsByCategory(category);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Create Blog =========================

export const createNewBlog = createAsyncThunk(
    "blogs/createBlog",
    async (blogData, thunkAPI) => {
        try {
            return await createBlog(blogData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ========================= Delete Blog =========================

export const deleteExistingBlog = createAsyncThunk(
    "blogs/deleteBlog",
    async (id, thunkAPI) => {
        try {
            return await deleteBlog(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ========================= Fetch Blogs By Tag =========================

export const fetchBlogsByTag = createAsyncThunk(
    "blogs/fetchBlogsTag",
    async (tag, thunkAPI) => {
        try {
            return await getBlogsByTag(tag);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Update Blog =========================

export const updateExistingBlog = createAsyncThunk(
    "blogs/updateBlog",
    async ({ id, blogData }, thunkAPI) => {
        try {
            return await updateBlog(id, blogData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ========================= Fetch Blog By ID =========================

export const fetchBlogById = createAsyncThunk(
    "blogs/fetchBlogById",
    async (id, thunkAPI) => {
        try {
            return await getBlogById(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ========================= Search Blogs =========================

export const fetchSearchBlogs = createAsyncThunk(
    "blogs/searchBlogs",
    async (params, thunkAPI) => {
        try {
            return await searchBlogs(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Trending Blogs =========================

export const fetchTrendingBlogs = createAsyncThunk(
    "blogs/fetchTrendingBlogs",
    async (_, thunkAPI) => {
        try {
            return await getTrendingBlogs();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Latest Blogs =========================

export const fetchLatestBlogs = createAsyncThunk(
    "blogs/fetchLatestBlogs",
    async (_, thunkAPI) => {
        try {
            return await getLatestBlogs();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Related Blogs =========================

export const fetchRelatedBlogs = createAsyncThunk(
    "blogs/fetchRelatedBlogs",
    async (slug, thunkAPI) => {
        try {
            return await getRelatedBlogs(slug);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ========================= Initial State =========================

const initialState = {
    blogs: [],
    currentBlog: null,

    myBlogs: [],

    searchResults: [],
    searchPagination: {},

    trendingBlogs: [],
    latestBlogs: [],
    relatedBlogs: [],

    categoryBlogs: [],
    currentCategory: null,

    tagBlogs: [],
    currentTag: "",

    loading: false,
    error: null,
};
const blogSlice = createSlice({
    name: "blogs",
    initialState,

    reducers: {
        clearCurrentBlog: (state) => {
            state.currentBlog = null;
        },

        clearBlogError: (state) => {
            state.error = null;
        },

        updateBlogLike(state, action) {
            const { blogId, likesCount, isLiked } = action.payload;

            const update = (blog) => {
                if (!blog) return;

                blog.likesCount = likesCount;
                blog.isLiked = isLiked;
            };

            update(state.blogs.find((b) => b._id === blogId));
            update(state.myBlogs.find((b) => b._id === blogId));

            update(state.searchResults.find((b) => b._id === blogId));
            update(state.trendingBlogs.find((b) => b._id === blogId));
            update(state.latestBlogs.find((b) => b._id === blogId));
            update(state.relatedBlogs.find((b) => b._id === blogId));

            update(state.categoryBlogs.find((b) => b._id === blogId));
            update(state.tagBlogs.find((b) => b._id === blogId));

            if (state.currentBlog?._id === blogId) {
                update(state.currentBlog);
            }
        },
    },

    extraReducers: (builder) => {
        builder

            // =========================
            // Fetch All Blogs
            // =========================

            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload?.data?.blogs || [];
            })

            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Fetch Blog By Slug
            // =========================

            .addCase(fetchBlogBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBlog = action.payload?.data || null;
            })

            .addCase(fetchBlogBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Create Blog
            // =========================

            .addCase(createNewBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createNewBlog.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.data) {
                    state.blogs.unshift(action.payload.data);
                }
            })

            .addCase(createNewBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Fetch My Blogs
            // =========================

            .addCase(fetchMyBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchMyBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.myBlogs = action.payload?.data || [];
            })

            .addCase(fetchMyBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.myBlogs = [];
            })

            // =========================
            // Delete Blog
            // =========================

            .addCase(deleteExistingBlog.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteExistingBlog.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.data.id;
                const removeBlog = (list) =>
                    list.filter((blog) => blog._id !== deletedId);
                state.blogs = removeBlog(state.blogs);
                state.myBlogs = removeBlog(state.myBlogs);
                state.searchResults = removeBlog(state.searchResults);
                state.trendingBlogs = removeBlog(state.trendingBlogs);
                state.latestBlogs = removeBlog(state.latestBlogs);
                state.relatedBlogs = removeBlog(state.relatedBlogs);
                state.categoryBlogs = removeBlog(state.categoryBlogs);
                state.tagBlogs = removeBlog(state.tagBlogs);
                if (state.currentBlog?._id === deletedId) {
                    state.currentBlog = null;
                }
            })
            
            .addCase(deleteExistingBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Update Blog
            // =========================

            .addCase(updateExistingBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateExistingBlog.fulfilled, (state, action) => {
                state.loading = false;

                const updatedBlog = action.payload.data;

                const updateList = (list) =>
                    list.map((blog) =>
                        blog._id === updatedBlog._id ? updatedBlog : blog
                    );

                state.blogs = updateList(state.blogs);
                state.myBlogs = updateList(state.myBlogs);
                state.searchResults = updateList(state.searchResults);
                state.trendingBlogs = updateList(state.trendingBlogs);
                state.latestBlogs = updateList(state.latestBlogs);
                state.relatedBlogs = updateList(state.relatedBlogs);
                state.categoryBlogs = updateList(state.categoryBlogs);
                state.tagBlogs = updateList(state.tagBlogs);

                if (
                    state.currentBlog &&
                    state.currentBlog._id === updatedBlog._id
                ) {
                    state.currentBlog = updatedBlog;
                }
            })

            .addCase(updateExistingBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Fetch Blog By Id
            // =========================

            .addCase(fetchBlogById.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBlog = action.payload?.data || null;
            })

            .addCase(fetchBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Search Blogs
            // =========================

            .addCase(fetchSearchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchSearchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults =
                    action.payload?.data?.blogs || [];

                state.searchPagination =
                    action.payload?.data?.pagination || {};
            })

            .addCase(fetchSearchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Trending Blogs
            // =========================

            .addCase(fetchTrendingBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchTrendingBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.trendingBlogs =
                    action.payload?.data?.blogs || [];
            })

            .addCase(fetchTrendingBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Latest Blogs
            // =========================

            .addCase(fetchLatestBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchLatestBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.latestBlogs =
                    action.payload?.data?.blogs || [];
            })

            .addCase(fetchLatestBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Related Blogs
            // =========================

            .addCase(fetchRelatedBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchRelatedBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.relatedBlogs =
                    action.payload?.data || [];
            })

            .addCase(fetchRelatedBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Blogs By Category
            // =========================

            .addCase(fetchBlogsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchBlogsByCategory.fulfilled, (state, action) => {
                state.loading = false;

                state.categoryBlogs =
                    action.payload?.data?.blogs || [];

                state.currentCategory =
                    action.payload?.data?.category || null;
            })

            .addCase(fetchBlogsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =========================
            // Blogs By Tag
            // =========================

            .addCase(fetchBlogsByTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchBlogsByTag.fulfilled, (state, action) => {
                state.loading = false;

                state.tagBlogs =
                    action.payload?.data?.blogs || [];

                state.currentTag =
                    action.payload?.data?.tag || "";
            })

            .addCase(fetchBlogsByTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentBlog,
    clearBlogError,
    updateBlogLike,
} = blogSlice.actions;

export default blogSlice.reducer;