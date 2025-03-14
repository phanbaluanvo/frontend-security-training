import axios from "axios";
import { Mutex } from "async-mutex";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/configs/config";

// Axios instance
const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

// Refresh token handler
const handleRefreshToken = async () => {
    return await mutex.runExclusive(async () => {
        try {
            const response = await instance.get("/auth/refresh");

            if (response && response.statusCode === 200) {
                const newToken = response.data.accessToken;
                if (newToken) {
                    localStorage.setItem("access_token", newToken);
                    return newToken;
                }
            }
            return null;
        } catch (error) {
            console.error("Refresh token failed:", error);
            localStorage.removeItem("access_token"); // Xóa token lỗi
            window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
            return null;
        }
    });
};

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        if (config.url !== "/auth/refresh") {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Suppress logging for 401 errors during token refresh
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest.headers[NO_RETRY_HEADER]
        ) {
            try {
                const newToken = await handleRefreshToken();
                if (newToken) {
                    console.clear();
                    originalRequest.headers[NO_RETRY_HEADER] = "true";
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return instance.request(originalRequest);
                }
            } catch (refreshError) {
                console.error("Failed to retry request after refreshing token:", refreshError);
            }
        }

        // Handle 400 errors during token refresh explicitly
        // Handle 400 errors during token refresh explicitly
        if (
            error.response &&
            error.response.status === 400 &&
            originalRequest.url.includes("/auth/refresh")
        ) {
            // Tránh log lỗi không cần thiết
            localStorage.removeItem("access_token");
            window.location.href = "/"; // Sử dụng window.location thay vì useNavigate()
        }


        // Handle 403 errors
        if (error.response && error.response.status === 403) {
            console.warn(
                "Unauthorized access: ",
                error.response.data?.message || "Unauthorized"
            );
        }

        // Avoid console.error for 401 handled cases
        if (
            error.response &&
            error.response.status === 401 &&
            originalRequest.headers[NO_RETRY_HEADER]
        ) {
            return Promise.reject("Silent 401 due to token refresh handling");
        }

        if (error.response.data) {
            return Promise.resolve(error.response.data)
        }

        return Promise.reject(error);
    }
);

export default instance;
