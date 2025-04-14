import React, { useState } from "react";
import Select from "@/components/common/Select";
import { Plus, Trash2 } from "lucide-react";
import Input from "./Input"; // Import Input component
import { v4 as uuidv4 } from "uuid";
import ConfirmModal from "./ConfirmModal";

const QuizQuestionCreator = ({ onSave, onChange, onCheck, onDelete, initialData = null, questionNumber }) => {
    const defaultState = {
        questionId: null,
        tempId: uuidv4(),
        questionType: "",
        questionText: "",
        answers: [{ answerId: "choice-1", tempId: uuidv4(), answerText: "", correct: false }],
    };

    const [questionData, setQuestionData] = useState(initialData || defaultState);

    const questionTypes = [
        { value: "MCQ", label: "Multiple Choice" },
        { value: "MULTIPLE_ANSWER", label: "Multiple Answer (Choose all that apply)" },
        { value: "TRUE_FALSE", label: "True/False" },
        { value: "SHORT_ANSWER", label: "Short Answer" }
    ];

    const handleQuestionTypeChange = (selectedOption) => {
        setQuestionData((prev) => ({
            ...prev,
            questionType: selectedOption ? selectedOption.value : "",
            answers: selectedOption?.value === "TRUE_FALSE"
                ? [{ answerId: null, tempId: uuidv4(), answerText: "True/False", correct: false }]
                : [{ answerId: null, tempId: uuidv4(), answerText: "", correct: false }],
        }));
    };




    const addAnswers = () => {
        const updatedQuestionData = {
            ...questionData,
            answers: [...questionData.answers, { answerId: null, tempId: uuidv4(), answerText: "", correct: false }]
        };

        setQuestionData(updatedQuestionData);
        onChange(updatedQuestionData);  // Truyền updatedQuestionData vào onChange
    };

    const removeAnswer = (idToRemove) => {
        const updatedAnswers = questionData.answers.filter((answer) => answer.tempId !== idToRemove);
        const updatedQuestionData = { ...questionData, answers: updatedAnswers };

        setQuestionData(updatedQuestionData);
        onChange(updatedQuestionData);  // Truyền updatedQuestionData vào onChange
    };

    const updateMcqChoice = (tempId, newText) => {
        const updatedAnswers = questionData.answers.map((choice) =>
            choice.tempId === tempId ? { ...choice, answerText: newText } : choice
        );
        const updatedQuestionData = { ...questionData, answers: updatedAnswers };

        setQuestionData(updatedQuestionData);
        onChange(updatedQuestionData);  // Truyền updatedQuestionData vào onChange
    };

    const handleCorrectAnswerChange = (option) => {
        const updatedAnswers = questionData.answers.map((answer) => ({
            ...answer,
            correct: option.value,
        }));
        const updatedQuestionData = { ...questionData, answers: updatedAnswers };

        setQuestionData(updatedQuestionData);
        onChange(updatedQuestionData);
    };

    const handleCorrectAnswerChangeMCQ = (selectedId) => {
        const updatedAnswers = questionData.answers.map((answer) => ({
            ...answer,
            correct: answer.tempId === selectedId
        }));
        const updatedQuestionData = { ...questionData, answers: updatedAnswers };

        setQuestionData(updatedQuestionData);
        onChange(updatedQuestionData);
    };

    const handleCorrectAnswerChangeMulti = (selectedId) => {
        const updatedAnswers = questionData.answers.map((answer) =>
            answer.tempId === selectedId
                ? { ...answer, correct: !answer.correct }
                : answer
        );
        const updatedQuestionData = { ...questionData, answers: updatedAnswers };

        setQuestionData(updatedQuestionData);
        onChange(updatedQuestionData);
    };




    return (
        <div className="w-full p-4 bg-white shadow-md border border-gray-200 rounded-lg text-sm relative">
            <h2 className="text-sm font-medium mb-3">Question {questionNumber}</h2>

            {/* Question Type - React Select */}
            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Question Type</label>
                <Select
                    className="w-full z-2"
                    value={questionTypes.find(type => type.value === questionData.questionType) || null}
                    onChange={handleQuestionTypeChange}
                    options={questionTypes}
                    isSearchable
                    placeholder="Select Question Type"
                />
            </div>

            {/* Layout 2 Cột */}
            {questionData.questionType && (
                <div className="grid grid-cols-2 gap-4">
                    {/* Left Column: Question Text */}
                    <div>
                        <Input
                            label="Question Text"
                            name="questionText"
                            value={questionData.questionText}
                            onChange={(e) =>
                                setQuestionData((prev) => ({
                                    ...prev,
                                    questionText: e.target.value
                                }))
                            }
                            placeholder="Enter your question"
                            className="text-xs px-2 py-1"
                        />
                    </div>

                    {/* Right Column: Answer Section */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Answer</label>

                        {/* Multiple Choice */}
                        {(questionData.questionType === "MCQ" || questionData.questionType === "MULTIPLE_ANSWER") && (
                            <>
                                {questionData.answers.map((answer, index) => (
                                    <div key={answer.tempId} className="flex items-center mb-1 space-x-2">
                                        <Input
                                            name={`choice-${index}`}
                                            value={answer.answerText}
                                            onChange={(e) => updateMcqChoice(answer.tempId, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-grow text-xs px-2 py-1"
                                        />
                                        {questionData.questionType === "MCQ" ? (
                                            <input
                                                type="radio"
                                                name={questionData.tempId}
                                                checked={answer.correct}
                                                onChange={() => handleCorrectAnswerChangeMCQ(answer.tempId)}
                                                className="mr-1 radio radio-sm"
                                            />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                name="correctAnswer"
                                                checked={answer.correct}
                                                onChange={() => handleCorrectAnswerChangeMulti(answer.tempId)}
                                                className="mr-1 checkbox checkbox-sm"
                                            />
                                        )}
                                        {questionData.answers.length > 1 && (
                                            <button
                                                onClick={() => removeAnswer(answer.tempId)}
                                                className="text-red-500 hover:bg-red-100 p-1 rounded-full"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addAnswers}
                                    className="flex items-center px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 mt-1"
                                >
                                    <Plus size={16} className="mr-1" /> Add Option
                                </button>
                            </>
                        )}

                        {/* True/False - React Select */}
                        {questionData.questionType === "TRUE_FALSE" && (
                            <Select
                                className="w-full z-1"
                                value={
                                    questionData.answers[0]?.correct !== undefined
                                        ? { value: questionData.answers[0].correct, label: questionData.answers[0].correct ? "True" : "False" }
                                        : null
                                }
                                onChange={handleCorrectAnswerChange}
                                options={[
                                    { value: true, label: "True" },
                                    { value: false, label: "False" }
                                ]}
                                placeholder="Select Answer"
                            />
                        )}


                        {/* Short Answer */}
                        {questionData.questionType === "SHORT_ANSWER" && (
                            <textarea
                                name="shortAnswer"
                                className="w-full p-2 border border-gray-300 rounded-sm focus:ring-0 focus:ring-grey-500 input min-h-[10vh]"
                                placeholder="Provide the expected answer"
                                value={questionData.correctAnswer || ""}
                                onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Delete Button (outside question type condition) */}
            {onDelete && (
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onDelete}
                        className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none"
                    >
                        Delete
                    </button>
                </div>
            )}

            <ConfirmModal
                modalId="confirmDeleteQuestion"
                onConfirm={() => {
                    onDelete();
                    document.getElementById("confirmDeleteQuestion").close();
                }}
                buttonColor="btn-error"
                buttonText="Delete"
            />
        </div>
    );
};

export default QuizQuestionCreator;
