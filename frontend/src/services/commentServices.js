import API from "../api/axios";

// Get comments of a blog
export const getBlogComments = async (blogId) => {
    const response = await API.get(`/comments/${blogId}`);
    return response.data;
};

// Create comment
export const createComment = async (blogId, content) => {
    const response = await API.post(`/comments/${blogId}`, {
        content,
    });

    return response.data;
};

// Update comment
export const updateComment = async (commentId, content) => {
    const response = await API.patch(`/comments/${commentId}`, {
        content,
    });

    return response.data;
};

// Delete comment
export const deleteComment = async (commentId) => {
    const response = await API.delete(`/comments/${commentId}`);
    return response.data;
};