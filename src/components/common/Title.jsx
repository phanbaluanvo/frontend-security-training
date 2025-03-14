import React from "react";
import { useLocation } from "react-router-dom";

const Title = ({ title }) => {
    return (
        <div className="mb-4">
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
    );
};

export default Title;