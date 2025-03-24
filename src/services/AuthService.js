import axios from "../configs/axios-customize";

export const login = async (formData) => {
    try {
        const response = await axios.post("/auth/login", formData);

        console.log(response)

        if (response.statusCode === 200) {

            const { accessToken, user } = response.data;

            // Save the token in localStorage
            localStorage.setItem("access_token", accessToken);

            // Return user role and success flag
            return {
                success: true,
                user: user,
            };
        }
    } catch (error) {
        console.error("Login failed:", error);

        // Return an error message if login fails
        return {
            success: false,
            message: error.response.data.message,
        };
    }
};

export const signout = async () => {
    try {
        const response = await axios.post("/auth/logout");

        console.log(response)

        if (response.statusCode === 200) {
            localStorage.removeItem("access_token");
        }
        return true;
    } catch (error) {
        console.error("Logout failed:", error);
        return false;
    }
}

export const fetchUserAccount = async () => {
    try {
        const response = await axios.get("/auth/account");
        if (response.statusCode === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch account");
        }
    } catch (error) {
        console.error("Error fetching account:", error);
        window.location.href = '/login';
        return null;
    }
};

export const fetchImage = async (imagePath) => {
    try {
        const response = await axios.get(`/images/${imagePath}`, {
            responseType: 'blob',
        });

        return URL.createObjectURL(response);

    } catch (error) {
        console.error('Error fetching image:', error);

    }
};