import axios from "axios";

const API = axios.create({
    baseURL: "https://blog-production-9ca1.up.railway.app",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;