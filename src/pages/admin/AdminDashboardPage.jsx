import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import TextEditor from "@/components/common/TextEditor";
import MCQCreator from "@/components/common/MCQCreator";
import CourseCard from "@/components/common/CourseCard";
import QuizQuestionCreator from "@/components/common/QuizQuestionCreator";
import { Plus } from "lucide-react";

const AdminDashboardPage = () => {
    const [content, setContent] = useState("");

    const [questions, setQuestions] = useState([]);

    const addQuestion = (questionData) => {
        setQuestions(prev => [...prev, questionData]);
    };

    const deleteQuestion = (indexToDelete) => {
        setQuestions(prev =>
            prev.filter((_, index) => index !== indexToDelete)
        );
    };


    return (
        <AdminLayout title="Dashboard">
            <div className="container mx-auto px-4">
                {questions.map((question, index) => (
                    <div className="mb-10">
                        <QuizQuestionCreator
                            key={index}
                            questionNumber={index + 1}
                            initialData={question}
                            onSave={(updatedQuestion) => {
                                const newQuestions = [...questions];
                                newQuestions[index] = updatedQuestion;
                                setQuestions(newQuestions);
                            }}
                            onDelete={() => deleteQuestion(index)}
                        />
                    </div>
                ))}

                <button
                    onClick={() => addQuestion(null)}
                    className="fixed bottom-6 right-6 bg-red-700 hover:bg-red-800 text-white text-sm p-3 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group hover:w-40"
                >
                    <div className="flex overflow-hidden">
                        {/* Dấu + */}
                        <Plus size={20} className="flex-shrink-0" />
                        {/* Chữ Add Question */}
                        <span className="hidden group-hover:inline whitespace-nowrap opacity-0 group-hover:opacity-200 transition-all duration-300">
                            Add Question
                        </span>
                    </div>
                </button>





            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;
