import React from "react";

const Toast = ({ message, error, visible }) => {
    if (!visible) return null;

    return (
        <div
            className={`fixed top-10 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded shadow-lg z-50 ${error ? "bg-red-700" : "bg-green-700"
                }`}
            role="alert"
        >
            {message}
            <div className={`mt-2 h-1 rounded ${error ? "bg-red-500" : "bg-green-500"}`}>
                <div
                    className={`h-full rounded transition-all ${error ? "bg-red-300" : "bg-green-300"
                        }`}
                    style={{ animation: "progress 3s linear forwards" }}
                ></div>
            </div>

            <style>
                {`
                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Toast;
