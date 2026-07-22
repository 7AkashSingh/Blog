import API from "../api/axios";

// Get All Blogs
export const getAllBlogs = async () => {
    console.log("BASE URL:", API.defaults.baseURL);

    const response = await API.get("/blogs");

    console.log(response.data);

    return response.data;
};

// Get Trending Blogs
export const getTrendingBlogs = async () => {
    const response = await API.get("/blogs/trending");
    return response.data;
};

// Get Latest Blogs
export const getLatestBlogs = async () => {
    const response = await API.get("/blogs/latest");
    return response.data;
};

// Get Blog By Slug
export const getBlogBySlug = async (slug) => {
    const response = await API.get(`/blogs/${slug}`);
    return response.data;
};

// Get Related Blogs
export const getRelatedBlogs = async (slug) => {
    const response = await API.get(`/blogs/${slug}/related`);
    return response.data;
};

// Search Blogs
export const searchBlogs = async (params) => {
    const response = await API.get("/blogs/search", {
        params,
    });

    return response.data;
};

// Get Blogs By Category
export const getBlogsByCategory = async (slug) => {
    const response = await API.get(`/blogs/category/${slug}`);
    return response.data;
};

// Get Blogs By Tag
export const getBlogsByTag = async (tag) => {
    const response = await API.get(`/blogs/tag/${tag}`);
    return response.data;
};

export const createBlog = async (blogData) => {
    const response = await API.post("/blogs", blogData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getMyBlogs = async () => {
    const response = await API.get("/blogs/my/blogs");
    return response.data;
};

export const deleteBlog = async (id) => {
    const response = await API.delete(`/blogs/${id}`);
    return response.data;
};

export const updateBlog = async(id, blogData)=>{

    const response = await API.patch(
        `/blogs/${id}`,
        blogData,
        {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    );

    return response.data;
}

export const getBlogById = async (id) => {
    const response = await API.get(`/blogs/id/${id}`);
     console.log(response.data);
    return response.data;
};