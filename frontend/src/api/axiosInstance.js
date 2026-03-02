import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Important for sending/receiving HTTP-Only cookies
});

// Intercept responses to handle 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthenticated - Zustand store will handle redirect
        }
        return Promise.reject(error);
    }
);

export default api;
