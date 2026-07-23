import axios from "axios";

const API = axios.create({
    baseURL: "https://blog-production-983f.up.railway.app/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;