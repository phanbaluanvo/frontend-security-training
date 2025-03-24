import React from "react";

const Input = ({ name, value, onChange, placeholder, type = "text", className = "", label, readOnly, disabled, ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="text-gray-600 text-sm font-medium">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full input border border-gray-300 focus:ring-0 focus:ring-grey-500 rounded-sm ${className} ${disabled || readOnly ? 'pointer-events-none' : ''}`}
                {...props}
                readOnly={readOnly}
                disabled={disabled}
            />
        </div>
    );
};

export default Input;
