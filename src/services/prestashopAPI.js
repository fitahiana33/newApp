import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    auth: {
        username: import.meta.env.VITE_API_KEY,
        password: ""
    },

    headers: {
        "Content-Type": "application/xml" 
    }
});

export default api;