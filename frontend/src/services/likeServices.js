import API from "../api/axios";

export const toggleLikeAPI = async (blogId) => {
    const res = await API.post(`/likes/${blogId}`);
    return res.data.data;
};


export const getBlogLikesAPI = async (blogId) => {
    const res = await API.get(`/likes/${blogId}`);
    return res.data.data;
};