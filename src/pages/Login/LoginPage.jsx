import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { login } from "../../services/AuthService";

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [passwordShown, setPasswordShown] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData);

        if (result.success) {
            setToast({ visible: true, message: "Login successful!", type: "success" });
            navigate("/learn");
        } else {
            setToast({
                visible: true,
                message: result.message || "Login failed. Please try again.",
                type: "error",
            });
            setTimeout(() => setToast({ ...toast, visible: false }), 3000);
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 bg-white py-4 px-6 flex justify-between items-center border-b shadow-md z-50 h-16">
                <Link to={'/'} >
                    <h1 className="text-2xl font-bold text-red-900">
                        AgentPhisher
                    </h1>
                </Link>
            </header>
            <section className="grid text-center h-screen items-center px-4 bg-base-200">
                <div className="w-full max-w-md mx-auto bg-base-100 p-8 rounded-xl shadow-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
                    <p className="text-gray-600 mb-6 text-[16px]">Enter your user ID and password to sign in</p>

                    <form onSubmit={handleSubmit} className="text-left space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium mb-1">
                                User ID
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="input input-bordered w-full"
                                placeholder="Enter User ID"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={passwordShown ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="input input-bordered w-full pr-10"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <div
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={() => setPasswordShown((prev) => !prev)}
                                >
                                    {passwordShown ? (
                                        <EyeIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link to="#" className="link text-sm text-gray-500 hover:text-red-800">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="btn bg-red-700 hover:bg-red-800 text-white w-full mt-2">
                            Sign In
                        </button>
                        <div className="divider">OR</div>
                        <button onClick={() => navigate("/signup")} type="button" className="btn btn-outline w-full mt-2">
                            Not Registered? <span className="text-red-700 font-medium">Create Account</span>
                        </button>

                    </form>
                </div>

                {/* Toast */}
                {toast.visible && (
                    <div className="toast toast-top toast-center z-50">
                        <div
                            className={`alert ${toast.type === "error"
                                ? "bg-red-700 text-white"
                                : toast.type === "success"
                                    ? "alert-success"
                                    : "alert-info"
                                }`}
                        >
                            <span>{toast.message}</span>
                        </div>
                    </div>
                )}
            </section>
        </>

    );
};

export default LoginPage;
