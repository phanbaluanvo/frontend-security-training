import React, { useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({
    title,
    description,
    imageUrl,
    imageAlt = "",
    isCompleted,
    learningTime,
    isInProgress,
    link,
    courseType,
    handleButtonClick,
    isLoading,
    btnText = "Enroll"
}) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const fullyLoaded = !isLoading && isImageLoaded;
    const navigate = useNavigate();

    const onButtonClick = (e) => {
        e.stopPropagation();
        handleButtonClick();
    };

    const handleCardClick = () => {
        navigate(link);
    };

    return (
        <a onClick={handleCardClick} className="flex justify-center cursor-pointer">
            <div className="card bg-base-100 shadow-lg aspect-[10/16] max-h-[420px] w-full">
                <figure className="aspect-[16/9] w-full relative">
                    {(!isImageLoaded || isLoading) && (
                        <div className="skeleton w-full h-full absolute top-0 left-0 rounded-t-lg z-10" />
                    )}
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        className={`w-full h-full object-cover transition-opacity duration-300 rounded-t-lg ${fullyLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setIsImageLoaded(true)}
                    />
                </figure>

                <div className="card-body pt-3">
                    <div className="flex justify-between items-center">
                        {isLoading ? (
                            <div className="skeleton h-4 w-24" />
                        ) : (
                            <span className="text-xs text-gray-500 font-bold">{courseType}</span>
                        )}
                        {isLoading ? (
                            <div className="skeleton h-4 w-16" />
                        ) : isInProgress ? (
                            <div className="badge text-red-900 border-red-900">In Progress</div>
                        ) : isCompleted ? (
                            <div className="badge text-white bg-green-700">Completed</div>
                        ) : null}
                    </div>

                    <div className="flex justify-between">
                        {isLoading ? (
                            <div className="skeleton h-6 w-3/4" />
                        ) : (
                            <span className="card-title">{title}</span>
                        )}
                    </div>

                    <div>
                        {isLoading ? (
                            <>
                                <div className="skeleton h-3 w-full my-1" />
                                <div className="skeleton h-3 w-5/6 my-1" />
                            </>
                        ) : (
                            <p>{description}</p>
                        )}
                    </div>

                    <div className="card-actions justify-between items-center mt-auto">
                        {isLoading ? (
                            <div className="skeleton h-4 w-24" />
                        ) : (
                            <div className="flex items-center gap-1 text-gray-500">
                                <Clock size={16} />
                                <span className="text-xs">{learningTime}</span>
                            </div>
                        )}
                        <button
                            disabled={isLoading}
                            className="btn z-10 bg-red-700 hover:bg-red-800 text-white min-w-[100px]"
                            onClick={onButtonClick}
                        >
                            {isLoading ? <span className="loading loading-spinner loading-xs"></span> : btnText}
                        </button>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default CourseCard;
