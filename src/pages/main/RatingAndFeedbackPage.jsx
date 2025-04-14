import Spinner from "@/components/common/Spinner";
import { rateCourse } from "@/services/CourseService";
import { Lock } from "lucide-react";
import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const RatingAndFeedbackPage = () => {
    const { courseId } = useParams(); // ✅ đã fix typo
    const { feedbackAccess } = useOutletContext();

    const [rating, setRating] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                courseId: Number(courseId),
                rating: Number(rating),
                feedback: feedback.trim(),
            };
            await rateCourse(payload);
        } catch (error) {
            console.error(error);
        } finally {
            setError(null);
            setSubmitted(true);
            setLoading(false)
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }


    if (!feedbackAccess) {
        return (
            <div className="flex flex-col items-center justify-center text-gray-600" style={{ minHeight: "calc(100vh - 4rem)" }}>
                <Lock className="w-20 h-20 text-gray-400 mb-4" />
                <div className="text-lg text-center">This resource is locked. Please complete all lessons to unlock.</div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
                <div className="text-center text-red-800 text-xl font-semibold">Thank you for your feedback!</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
            <div className="max-w-4xl w-full px-6 py-8 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-6">Rate your experience</h2>

                <div className="rating justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <input
                            key={val}
                            type="radio"
                            name="rating"
                            className="mask mask-star bg-red-800"
                            aria-label={`${val} star`}
                            checked={rating === val}
                            onChange={() => setRating(val)}
                        />
                    ))}
                </div>

                <textarea
                    placeholder="Leave your feedback here..."
                    className="textarea textarea-bordered w-full h-32 mb-6"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <button
                    className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default RatingAndFeedbackPage;
