import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import QuizQuestionCreator from "@/components/common/QuizQuestionCreator";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createQuiz, deleteQuestionInQuiz, fetchListQuestionsByCourseIdAndQuizId, updateQuiz } from "@/services/QuizService";
import Select from "@/components/common/Select";
import Spinner from "@/components/common/Spinner";

const QuizzHandlingPage = () => {
    const navigate = useNavigate();
    const { courseId, quizId } = useParams();
    const isEditing = Boolean(quizId);
    const [isLoading, setIsLoading] = useState(false);

    const difficultyOptions = [
        { value: "EASY", label: "Easy" },
        { value: "MEDIUM", label: "Medium" },
        { value: "HARD", label: "Hard" }
    ];

    const [quizDetails, setQuizDetails] = useState({
        quizName: "",
        description: "",
        active: true,
        difficulty: "EASY"
    });

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (isEditing) {
            fetchQuizData(courseId, quizId);
        }
    }, [courseId, quizId]);

    const fetchQuizData = async (courseId, quizId) => {
        try {
            setIsLoading(true); // bắt đầu loading
            const data = await fetchListQuestionsByCourseIdAndQuizId(courseId, quizId);
            const quiz = data[0];

            setQuizDetails({
                quizName: quiz.quizName,
                description: quiz.description,
                active: quiz.active,
                difficulty: quiz.difficulty
            });

            const transformedQuestions = quiz.questions.map((q) => ({
                questionId: q.questionId,
                tempId: uuidv4(),
                questionText: q.questionText,
                questionType: q.questionType,
                answers: q.answers.map(a => ({
                    answerId: a.answerId,
                    tempId: uuidv4(),
                    answerText: a.answerText,
                    correct: a.correct
                }))
            }));

            setQuestions(transformedQuestions);
        } catch (error) {
            console.error("Failed to load lesson data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuizChange = (field, value) => {
        setQuizDetails(prev => ({ ...prev, [field]: value }));
    };

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                tempId: uuidv4(),
                questionId: null,
                questionType: "",
                questionText: "",
                answers: [
                    {
                        tempId: uuidv4(),
                        answerId: null,
                        answerText: "",
                        correct: false
                    }
                ]
            }
        ]);
    };

    const deleteQuestion = async (idToDelete) => {
        if (isEditing) {
            const question = questions.find(q => q.tempId === idToDelete);
            // Nếu cần gọi API để xóa, thêm code vào đây.
            if (question && question.questionId) {
                await deleteQuestionInQuiz(quizId, question.questionId);
            }
        }

        // Cập nhật lại state câu hỏi, loại bỏ câu hỏi với tempId cần xóa
        setQuestions(prev => prev.filter(question => question.tempId !== idToDelete));
    };


    const buildQuizPayload = () => {
        return {
            quizName: quizDetails.quizName,
            description: quizDetails.description,
            difficulty: quizDetails.difficulty,
            active: quizDetails.active ? 1 : 0,
            courseId: Number(courseId),
            questions: questions.map(q => ({
                questionId: q.questionId,
                questionText: q.questionText,
                questionType: q.questionType,
                answers: q.answers.map(a => ({
                    answerId: a.answerId,
                    answerText: a.answerText,
                    correct: a.correct
                }))
            }))
        };
    };


    const handleSaveAll = async () => {
        const payload = buildQuizPayload();
        console.log("Quiz Payload:", payload);

        try {
            if (isEditing) {
                await updateQuiz(quizId, payload);
            } else {
                await createQuiz(payload);
            }
        } catch (error) {
            throw error;
        }
    };


    return (
        <AdminLayout title={isEditing ? "Edit Quiz" : "Create Quiz"}>
            <div className="container mx-auto px-4">
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {/* Form Quiz Info */}
                        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
                            <div className="mb-4">
                                <label className="block font-semibold mb-1">Quiz Name</label>
                                <input
                                    type="text"
                                    value={quizDetails.quizName}
                                    onChange={(e) => handleQuizChange("quizName", e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-semibold mb-1">Description</label>
                                <textarea
                                    value={quizDetails.description}
                                    onChange={(e) => handleQuizChange("description", e.target.value)}
                                    className="textarea textarea-bordered w-full"
                                />
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div>
                                    <label className="block font-semibold mb-1">Difficulty</label>
                                    <Select
                                        className="w-[10vw] z-2"
                                        value={difficultyOptions.find(option => option.value === quizDetails.difficulty) || null}
                                        onChange={(selectedOption) => handleQuizChange("difficulty", selectedOption?.value || "")}
                                        options={difficultyOptions}
                                        isSearchable
                                        placeholder="Select Difficulty"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <input
                                        type="checkbox"
                                        checked={quizDetails.active}
                                        onChange={(e) => handleQuizChange("active", e.target.checked)}
                                        className="toggle toggle-success"
                                    />
                                    <label className="font-semibold">Active</label>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleSaveAll}
                                    className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none"
                                >
                                    Save Quiz
                                </button>
                            </div>
                        </div>

                        {/* List of Questions */}
                        {questions.map((question, index) => (
                            <div key={question.tempId} className="mb-10">
                                <QuizQuestionCreator
                                    questionNumber={index + 1}
                                    initialData={question}
                                    onSave={(updatedQuestion) => {
                                        setQuestions(prev =>
                                            prev.map(q => (q.tempId === question.tempId ? updatedQuestion : q))
                                        );
                                    }}
                                    onChange={(updatedQuestion) => {
                                        setQuestions(prev =>
                                            prev.map(q => (q.tempId === question.tempId ? updatedQuestion : q))
                                        );
                                    }}
                                    onDelete={() => deleteQuestion(question.tempId)}
                                // onDelete={() => console.log(question.tempId)}

                                />
                            </div>
                        ))}
                    </>
                )}

                {/* Add Question Button */}
                <button
                    onClick={addQuestion}
                    className="z-15 fixed bottom-6 right-6 bg-red-700 hover:bg-red-800 text-white text-sm p-3 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group hover:w-40"
                >
                    <div className="flex overflow-hidden">
                        <Plus size={20} className="flex-shrink-0" />
                        <span className="hidden group-hover:inline whitespace-nowrap opacity-0 group-hover:opacity-200 transition-all duration-300">
                            Add Question
                        </span>
                    </div>
                </button>
            </div>
        </AdminLayout>
    );
};

export default QuizzHandlingPage;
