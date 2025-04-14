import { signup } from "@/services/AuthService";
import { CircleCheck, CircleX } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PasswordCriteria = ({ isValid, label }) => {
    return (
        <div className={`flex items-center gap-2 ${isValid ? "text-green-600" : "text-gray-500"}`}>
            <span>{isValid ? <CircleCheck /> : <CircleX />}</span>
            <span>{label}</span>
        </div>
    );
};

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "STUDENT",
        password: "",
        confirmPassword: "",
    });

    const [passwordErrors, setPasswordErrors] = useState({
        minLength: false,
        hasNumber: false,
        hasLowercase: false,
        hasUppercase: false,
        hasSpecialChar: false,
    });

    const [isPasswordMatch, setIsPasswordMatch] = useState(false);
    const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "", type: "info" });


    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);

        if (name === "password") {
            if (!passwordTouched && value.length > 0) {
                setPasswordTouched(true);
            }

            const newErrors = {
                minLength: value.length >= 8,
                hasNumber: /\d/.test(value),
                hasLowercase: /[a-z]/.test(value),
                hasUppercase: /[A-Z]/.test(value),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            };

            setPasswordErrors(newErrors);

            // Check if confirm password matches the new password value
            if (updatedForm.confirmPassword.length > 0) {
                setIsPasswordMatch(value === updatedForm.confirmPassword);
            }

            // Show password criteria if user is typing a password
            if (value.length > 0 && !showPasswordCriteria) {
                setShowPasswordCriteria(true);
            }
        }

        if (name === "confirmPassword") {
            if (!confirmPasswordTouched && value.length > 0) {
                setConfirmPasswordTouched(true);
            }

            setIsPasswordMatch(updatedForm.password === value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { confirmPassword, ...submitData } = formData;

        if (isPasswordMatch) {
            const result = await signup(formData);
            console.log(submitData);
            if (result.success) {
                setToast({ visible: true, message: "Signup successful!", type: "success" });
                setTimeout(() => setToast({ ...toast, visible: false }), 3000);
                navigate("/login");
            } else {
                setToast({
                    visible: true,
                    message: result.message || "Signup failed. Please try again.",
                    type: "error",
                });
                setTimeout(() => setToast({ ...toast, visible: false }), 3000);
            }
        } else {
            setToast({ visible: true, message: "Password does not match!", type: "error" });
            setTimeout(() => setToast({ ...toast, visible: false }), 3000);
        }


    };

    // Check if all password criteria are met and the password field has been interacted with
    const allCriteriaMet = Object.values(passwordErrors).every(Boolean);
    const shouldShowPasswordSuccess = passwordTouched && allCriteriaMet && formData.password.length > 0;

    // Check if passwords match for the confirm password field
    const shouldShowConfirmSuccess =
        confirmPasswordTouched &&
        isPasswordMatch &&
        formData.confirmPassword.length > 0 &&
        allCriteriaMet;

    const shouldShowConfirmError =
        confirmPasswordTouched &&
        !isPasswordMatch &&
        formData.confirmPassword.length > 0;

    // Handle focus events
    const handlePasswordFocus = () => {
        setPasswordTouched(true);
        if (formData.password.length > 0 && !showPasswordCriteria) {
            setShowPasswordCriteria(true);
        }
    };

    const handleConfirmPasswordFocus = () => {
        setConfirmPasswordTouched(true);
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
            <section className="grid text-center min-h-screen items-center p-8 bg-base-200">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Sign Up</h2>
                    <p className="mb-8 text-gray-600">Create your account to get started</p>
                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto max-w-md text-left bg-base-100 p-8 rounded-xl shadow-lg"
                    >
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">User ID</label>
                            <input
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                                className="input input-bordered w-full validator"
                                placeholder="Enter your User ID"
                                autoComplete="on"
                                minLength="5"
                                maxLength="30"
                                title="Please input valid user id"
                            />
                            <div className="validator-hint hidden">Enter valid User ID</div>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                autoComplete="on"
                                className="input input-bordered w-full validator"
                                placeholder="Enter your First Name"
                            />
                            <div className="validator-hint hidden">Enter first name</div>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                autoComplete="on"
                                className="input input-bordered w-full validator"
                                placeholder="Enter your Last Name"
                            />
                            <div className="validator-hint hidden">Enter last name</div>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="on"
                                placeholder="mail@site.com"
                                className="input validator w-full"
                            />
                            <div className="validator-hint hidden">Enter valid email address</div>
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={handlePasswordFocus}
                                required
                                placeholder="Password"
                                className={`input w-full ${shouldShowPasswordSuccess ? "input-success" : ""
                                    }`}
                            />
                            {(showPasswordCriteria || passwordTouched) && (
                                <div className="mt-2 space-y-1 text-sm">
                                    <PasswordCriteria isValid={passwordErrors.minLength} label="At least 8 characters" />
                                    <PasswordCriteria isValid={passwordErrors.hasNumber} label="At least one number" />
                                    <PasswordCriteria isValid={passwordErrors.hasLowercase} label="At least one lowercase letter" />
                                    <PasswordCriteria isValid={passwordErrors.hasUppercase} label="At least one uppercase letter" />
                                    <PasswordCriteria isValid={passwordErrors.hasSpecialChar} label="At least one special character" />
                                </div>
                            )}
                            <div className="validator-hint hidden">Enter valid password</div>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label className="block mb-1 font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onFocus={handleConfirmPasswordFocus}
                                required
                                className={`input input-bordered w-full ${shouldShowConfirmSuccess
                                    ? "input-success"
                                    : shouldShowConfirmError
                                        ? "input-error"
                                        : ""
                                    }`}
                                placeholder="Re-enter your password"
                            />
                            {shouldShowConfirmError && (
                                <div className="text-red-600 text-sm mt-1">Passwords do not match</div>
                            )}
                            <div className="validator-hint hidden">Confirm your password</div>
                        </div>

                        <input type="hidden" name="role" value="STUDENT" />

                        <button type="submit" className="btn bg-red-700 hover:bg-red-800 text-white w-full mt-2">
                            Sign Up
                        </button>
                        <div className="divider">OR</div>
                        <button onClick={() => navigate("/login")} type="button" className="btn btn-outline w-full mt-2">
                            Already have an account? <span className="text-red-700 font-medium">Back to login</span>
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

export default SignUpPage;