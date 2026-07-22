import axios from "axios";


const API_URL = "http://localhost:8000/api/v1/categories";


export const getCategoriesAPI = async () => {

    const response = await axios.get(API_URL);

    return response.data.data;
};