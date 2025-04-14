import React, { useState, useEffect } from "react";

const QuizQuestionCard = ({
    question,
    index,
    userAnswer,
    onAnswerChange,
    onCheckAnswer,
    onNext,
    onPrevious,
    isFirst,
    isLast,
    onCompleteQuiz, // Thêm hàm gọi khi hoàn thành quiz
}) => {
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setSelected(userAnswer?.selected || []);
    }, [question]);

    const handleSelect = (answerId) => {
        if (userAnswer?.status === "correct") return;

        if (question.questionType === "MCQ" || question.questionType === "TRUE_FALSE") {
            setSelected([answerId]);
            onAnswerChange(question.questionId, [answerId]);
        } else if (question.questionType === "MULTIPLE_ANSWER") {
            const newSelected = selected.includes(answerId)
                ? selected.filter((id) => id !== answerId)
                : [...selected, answerId];
            setSelected(newSelected);
            onAnswerChange(question.questionId, newSelected);
        }
    };

    const correctAnswers =
        question.questionType === "TRUE_FALSE"
            ? [question.answers[0]?.correct ? "true" : "false"]
            : question.answers.filter((a) => a.correct).map((a) => a.answerId);

    const getStatusLabel = () => {
        if (!userAnswer?.status) return null;
        if (userAnswer.status === "correct") return <p className="text-green-600">Correct!</p>;
        if (userAnswer.status === "partial") return <p className="text-yellow-600">Partially correct!</p>;
        return <p className="text-red-600">Incorrect. Try again!</p>;
    };

    const renderAnswers = () => {
        if (question.questionType === "TRUE_FALSE") {
            return ["true", "false"].map((val) => {
                const inputId = `q-${question.questionId}-a-${val}`;
                const isChecked = selected.includes(val);
                return (
                    <div key={val} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id={inputId}
                            name={`question-${question.questionId}`}
                            className="radio radio-sm"
                            checked={isChecked}
                            onChange={() => handleSelect(val)}
                            disabled={userAnswer?.status === "correct"}
                        />
                        <label htmlFor={inputId} className="cursor-pointer">
                            {val.charAt(0).toUpperCase() + val.slice(1)}
                        </label>
                    </div>
                );
            });
        }

        return question.answers.map((answer) => {
            const inputType = question.questionType === "MULTIPLE_ANSWER" ? "checkbox" : "radio";
            const isChecked = selected.includes(answer.answerId);
            return (
                <div key={answer.answerId} className="flex items-center space-x-2">
                    <input
                        type={inputType}
                        id={`q-${question.questionId}-a-${answer.answerId}`}
                        name={`question-${question.questionId}`}
                        className={`${inputType} ${inputType}-sm`}
                        checked={isChecked}
                        onChange={() => handleSelect(answer.answerId)}
                        disabled={userAnswer?.status === "correct"}
                    />
                    <label
                        htmlFor={`q-${question.questionId}-a-${answer.answerId}`}
                        className="cursor-pointer"
                    >
                        {answer.answerText}
                    </label>
                </div>
            );
        });
    };

    const handleFinishQuiz = () => {
        onCompleteQuiz();
    };

    return (
        <div className="card bg-white shadow-md mb-6 border border-gray-200">
            <div className="card-body">
                <h2 className="card-title text-base font-semibold mb-4">
                    Q{index + 1}. {question.questionText}
                </h2>

                <div className="space-y-4 mb-4">
                    {renderAnswers()}
                </div>

                {getStatusLabel()}

                <div className="flex justify-between items-center pt-6 border-t mt-6">
                    {/* Nút Previous hiển thị và disable ở câu đầu tiên */}
                    <button
                        onClick={onPrevious}
                        className="btn btn-outline min-w-[100px]"
                        disabled={isFirst} // Disable nếu là câu đầu tiên
                    >
                        ← Previous
                    </button>

                    <button
                        className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none"
                        onClick={() =>
                            onCheckAnswer(question.questionId, correctAnswers, question.questionType)
                        }
                        disabled={userAnswer?.status === "correct"}
                    >
                        Check
                    </button>

                    {!isLast ? (
                        <button
                            onClick={onNext}
                            className="btn btn-outline min-w-[100px]"
                            disabled={userAnswer?.status !== "correct"}
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleFinishQuiz}
                            className="btn btn-success min-w-[100px]"
                            disabled={userAnswer?.status !== "correct"}
                        >
                            Finish Quiz
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default QuizQuestionCard;
