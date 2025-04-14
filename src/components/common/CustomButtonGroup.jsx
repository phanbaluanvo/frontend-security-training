import React from "react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

const CustomButtonGroup = ({ onPrevious, onNext, className = "text-red-700 hover:text-red-800" }) => {
    return (
        <div className="flex gap-2">
            <button onClick={onPrevious} className="cursor-pointer">
                <CircleArrowLeft size={32} className={className} />
            </button>

            <button onClick={onNext} className="cursor-pointer">
                <CircleArrowRight size={32} className={className} />
            </button>
        </div>
    );
};

export default CustomButtonGroup;
