import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService"; // Import login function
import Toast from "../../components/common/Toast";

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(formData);

        console.log(result)

        if (result.success) {
            setToastMessage("Login successful!");
            setIsError(false);
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);

            navigate(result.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
        } else {
            setToastMessage(result.message || "Login failed. Please try again.");
            setIsError(true);
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 w-full">
            <div className="container max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                    AgentPhisher
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="userId" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            User ID
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-900 transition-all duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>

            {/* Toast Component */}
            <Toast message={toastMessage} error={isError} visible={toastVisible} />
        </div>
    );
};

export default LoginPage;
