import React from "react"
import { Clock } from "lucide-react";

const CourseCard = ({
    title,
    description,
    imageUrl,
    imageAlt = "",
    isNew,
    learningTime,
    isInProgress,
    link,
    courseType,
    handleButtonClick
}) => {

    const onButtonClick = (e) => {
        e.stopPropagation();
        handleButtonClick();
    };

    const handleCardClick = () => {
    }

    return (
        <a onClick={handleCardClick} className="flex justify-center">
            <div className="card bg-base-100 shadow-lg aspect-[10/16] max-h-[420px]">
                <figure className="aspect-[16/9] w-full">
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="w-full h-full object-cover"
                    />
                </figure>
                {/* <div className="absolute top-0 right-0 bg-red-700 text-white font-bold px-2 py-1 m-2 rounded-md">
                New
            </div> */}
                <div className="card-body pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold">{courseType}</span>
                        {isInProgress && <div className="badge badge-outline badge-info">In Progress</div>}
                    </div>
                    <div className="flex justify-between">
                        <span className="card-title">{title}</span>
                    </div>
                    <p>{description}</p>
                    <div className="card-actions justify-between items-center">
                        <div className="flex items-center gap-1 text-gray-500">
                            <Clock size={16} />
                            <span className="text-xs ">{learningTime}</span>
                        </div>
                        <button
                            className="btn z-10 bg-red-700 hover:bg-red-800 text-white min-w-[100px]"
                            onClick={onButtonClick}
                        >Enroll</button>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default CourseCard;