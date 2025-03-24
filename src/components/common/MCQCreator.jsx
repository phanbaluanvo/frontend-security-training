import React, { useState } from "react";

const MCQCreator = () => {
    // State để lưu trữ câu hỏi
    const [question, setQuestion] = useState("");

    // State để lưu trữ danh sách câu trả lời
    const [answers, setAnswers] = useState([""]);

    // Hàm xử lý thay đổi nội dung câu hỏi
    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    // Hàm xử lý thay đổi nội dung câu trả lời
    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    // Hàm thêm câu trả lời mới
    const handleAddAnswer = () => {
        setAnswers([...answers, ""]);
    };

    // Hàm xóa câu trả lời
    const handleRemoveAnswer = (index) => {
        const newAnswers = answers.filter((_, i) => i !== index);
        setAnswers(newAnswers);
    };

    // Hàm xử lý khi submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Question:", question);
        console.log("Answers:", answers);
        alert("Question and answers submitted!");
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Create MCQ Question</h2>
            <form onSubmit={handleSubmit}>
                {/* Trường nhập câu hỏi */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question:
                    </label>
                    <input
                        type="text"
                        value={question}
                        onChange={handleQuestionChange}
                        placeholder="Enter your question"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Danh sách câu trả lời */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answers:
                    </label>
                    {answers.map((answer, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder={`Answer ${index + 1}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {/* Nút xóa câu trả lời (nếu có nhiều hơn 1 câu trả lời) */}
                            {answers.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAnswer(index)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    {/* Nút thêm câu trả lời */}
                    <button
                        type="button"
                        onClick={handleAddAnswer}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Add Answer
                    </button>
                </div>

                {/* Nút submit */}
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit Question
                </button>
            </form>
        </div>
    );
};

export default MCQCreator;