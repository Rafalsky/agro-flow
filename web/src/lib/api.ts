import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optional: Global error handling
        if (error.response?.status === 401) {
            // Don't redirect here, let AuthContext handle state
        }
        return Promise.reject(error);
    }
);
