import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Spinner from "@/components/common/Spinner";
import QuizQuestionCard from "@/components/common/QuizQuestionCard";
import { fetchListQuestionsByCourseIdAndQuizId } from "@/services/QuizService";
import { Lock } from "lucide-react";

const QuizContent = () => {
    const { courseId, quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isRetaking, setIsRetaking] = useState(false);
    const { quizAccess, handleQuizComplete, courseComplete } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await fetchListQuestionsByCourseIdAndQuizId(courseId, quizId);
                setQuiz(data[0]);
            } catch (error) {
                console.error("Failed to fetch quiz:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (questionId, selectedAnswers) => {
        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                selected: selectedAnswers,
            },
        }));
    };

    const handleCheckAnswer = (questionId, correctAnswers, type) => {
        const selected = userAnswers[questionId]?.selected || [];
        let status = "incorrect";

        if (type === "MCQ" || type === "TRUE_FALSE") {
            if (selected.length === 1 && correctAnswers.includes(selected[0])) {
                status = "correct";
            }
        } else if (type === "MULTIPLE_ANSWER") {
            const selectedSet = new Set(selected);
            const correctSet = new Set(correctAnswers);
            if (selectedSet.size === correctSet.size && [...correctSet].every((id) => selectedSet.has(id))) {
                status = "correct";
            } else if ([...selectedSet].some((id) => correctSet.has(id))) {
                status = "partial";
            }
        }

        setUserAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                status,
            },
        }));
    };

    const handleNext = () => {
        if (currentIndex < quiz.questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => prev - 1);
    };

    const handleCompleteQuiz = () => {
        handleQuizComplete();
        setQuizCompleted(true);
        setIsRetaking(false);
    };

    const handleRetake = () => {
        setCurrentIndex(0);
        setUserAnswers({});
        setQuizCompleted(false);
        setIsRetaking(true);
    };

    const renderRetakeSection = () => {
        return (
            <div className="text-red-800 flex flex-col items-center justify-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
                <p className="text-xl mb-4">Congratulation! You have completed this quiz</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(`/learn/courses/${courseId}/feedback`)}
                        className="btn min-w-[10vw] text-red-700 bg-transparent border-2 border-red-700 hover:bg-red-700 hover:text-white"
                    >
                        Rate this course
                    </button>
                    <button
                        onClick={handleRetake}
                        className="btn min-w-[10vw] text-white bg-red-700 hover:bg-red-800 border-none"
                    >
                        Retake Quiz
                    </button>

                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="text-center mt-10 text-lg text-gray-600">
                Quiz not found.
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentIndex];
    const userAnswer = userAnswers[currentQuestion.questionId];

    if (!quizAccess) {
        return (
            <div
                className="flex flex-col items-center justify-center text-gray-600"
                style={{ minHeight: "calc(100vh - 4rem)" }}
            >
                <Lock className="w-20 h-20 text-gray-400 mb-4" />
                <div className="text-lg text-center">
                    This resource is locked. Please complete all lessons to unlock.
                </div>
            </div>
        );
    }

    if (courseComplete && !isRetaking) {
        return renderRetakeSection();
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">

            <>
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {quiz.quizName}
                </h1>
                <QuizQuestionCard
                    question={currentQuestion}
                    index={currentIndex}
                    userAnswer={userAnswer}
                    onAnswerChange={handleAnswerChange}
                    onCheckAnswer={handleCheckAnswer}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isFirst={currentIndex === 0}
                    isLast={currentIndex === quiz.questions.length - 1}
                    onCompleteQuiz={handleCompleteQuiz}
                />
            </>

        </div>
    );
};

export default QuizContent;
