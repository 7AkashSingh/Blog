import API from "../api/axios.js";



export const getCategoriesAPI = async () => {
    const response = await API.get("/categories");
    return response.data.data;
};