import API from "../api/axios.js";

export const loginAPI = async (userData) => {
    const response = await API.post("/users/login", userData);
    return response.data;
};

export const registerAPI = async (userData) => {
    const response = await API.post("/users/register", userData);
    return response.data;
};

export const logoutAPI = async () => {
    const response = await API.post("/users/logout");
    return response.data;
};

export const getCurrentUserAPI = async () => {
    const response = await API.get("/users/current-user");
    return response.data;
};