import React from "react";

const Spinner = ({ height = "h-screen" }) => {
    return (
        <div className={`flex justify-center items-center h-[calc(100vh-16rem)] pt-0`}>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-700 border-solid"></div>
        </div>
    );
};

export default Spinner;
