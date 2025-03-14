import React from "react";

const Spinner = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-700 border-solid"></div>
        </div>
    );
};

export default Spinner;
