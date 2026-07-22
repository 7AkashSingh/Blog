import API from "../api/axios";

export const getUserProfileAPI = async (username) => {

    const response = await API.get(
        `/users/${username}`
    );

    return response.data.data;
};

export const getUserBlogsAPI = async (username) => {

    const response = await API.get(
        `/users/${username}/blogs`
    );

    return response.data.data;
};