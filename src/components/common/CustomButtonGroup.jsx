import React from "react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

const CustomButtonGroup = ({ onPrevious, onNext }) => {
    return (
        <div className="flex gap-2">
            <button
                onClick={onPrevious}
                className="cursor-pointer"
            >
                <CircleArrowLeft
                    size={32}
                    className={`text-red-700 hover:text-red-800`}
                />
            </button>

            <button
                onClick={onNext}
                className="cursor-pointer"
            >
                <CircleArrowRight
                    size={32}
                    className={`text-red-700 hover:text-red-800`}
                />
            </button>
        </div>
    );
};

export default CustomButtonGroup;