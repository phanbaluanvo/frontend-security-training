import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, Lock, CircleCheck, LockOpen } from 'lucide-react';
import "react-circular-progressbar/dist/styles.css";

const CourseSidebar = ({ course, modules, quizzes = [], quizAccess = false, completePercentage = 0, feedbackAcess = false }) => {
    const [expandedModules, setExpandedModules] = useState(new Set());
    const [isQuizExpanded, setIsQuizExpanded] = useState(true);
    const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(true);
    const location = useLocation();

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId);
            } else {
                newSet.add(moduleId);
            }
            return newSet;
        });
    };

    const toggleQuiz = () => {
        setIsQuizExpanded(prev => !prev);
    };

    const toggleFeedback = () => {
        setIsFeedbackExpanded(prev => !prev);
    };

    const isLessonActive = (lessonId) => location.pathname.includes(`/lessons/${lessonId}`);
    const isQuizActive = (quizId) => location.pathname.includes(`/quizzes/${quizId}`);
    const isFeedbackActive = () => location.pathname.includes(`/feedback`);

    useEffect(() => {
        if (modules?.length) {
            setExpandedModules(new Set(modules.map((module) => module.moduleId)));
        }
    }, [modules]);

    return (
        <div className="bg-gray-200 w-90 min-h-screen max-h-screen overflow-y-auto fixed left-0 z-10 flex flex-col">
            {/* Header */}
            <div className="p-6 bg-red-800 text-white w-full sticky top-0 z-20">
                <header className="text-4xl font-bold mb-12">{course?.courseName}</header>
                <div className="text-white mb-2">
                    <div className="w-full bg-gray-500 h-2 mb-1 rounded-full">
                        <div className="bg-white h-2 rounded-full" style={{ width: `${completePercentage}%` }}></div>
                    </div>
                    <span className="text-md">{completePercentage}% COMPLETED</span>
                </div>
            </div>

            {/* Modules */}
            <div className="py-4 menu flex-1">
                {modules?.map((module) => (
                    <div key={module.moduleId} className="mb-2">
                        <div
                            onClick={() => toggleModule(module.moduleId)}
                            className="py-3 cursor-pointer border-b border-gray-400/50 mx-6"
                        >
                            <div className="flex items-center gap-3">
                                {expandedModules.has(module.moduleId)
                                    ? <ChevronDown className="text-gray-400 w-4" />
                                    : <ChevronRight className="text-gray-400 w-4" />}
                                <span className="font-medium text-gray-700">{module.moduleName}</span>
                            </div>
                        </div>

                        {expandedModules.has(module.moduleId) && (
                            <div className="ml-12 space-y-2 mt-2">
                                {module.lessons?.map((lesson) => (
                                    <Link
                                        key={lesson.lessonId}
                                        to={`/learn/courses/${course.courseId}/lessons/${lesson.lessonId}`}
                                        className={`block py-2 px-4 rounded-lg text-sm ${isLessonActive(lesson.lessonId)
                                            ? 'bg-blue-50 text-red-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 min-h-[2rem] w-full">
                                            <span className="line-clamp-2 flex-1 leading-5">{lesson.lessonName}</span>
                                            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                                {lesson.complete && (
                                                    <CircleCheck className="text-white rounded-full bg-red-700 w-5 h-5" />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Final Quiz */}
                {quizzes.length > 0 && (
                    <div className="mb-2">
                        <div
                            onClick={toggleQuiz}
                            className="py-3 cursor-pointer border-b border-gray-400/50 mx-6"
                        >
                            <div className="flex items-center gap-3">

                                {isQuizExpanded
                                    ? <ChevronDown className="text-gray-400 w-4" />
                                    : <ChevronRight className="text-gray-400 w-4" />}
                                <span className="font-semibold text-gray-700">Final Quiz</span>
                            </div>
                        </div>

                        {isQuizExpanded && (
                            <div className="ml-12 space-y-2 mt-2">
                                {quizzes.map((quiz) => (
                                    <Link
                                        key={quiz.quizId}
                                        to={`/learn/courses/${course.courseId}/quizzes/${quiz.quizId}`}
                                        className={`block py-2 px-4 rounded-lg text-sm ${isQuizActive(quiz.quizId)
                                            ? 'bg-blue-50 text-red-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 min-h-[2rem] w-full">
                                            <span className="line-clamp-2 flex-1 leading-5">{quiz.quizName}</span>
                                            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                                {!quizAccess && (
                                                    <Lock className="w-4 h-4" />
                                                )}

                                                {course.complete && (
                                                    <CircleCheck className="text-white rounded-full bg-red-700 w-5 h-5" />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-2">
                    <div
                        onClick={toggleFeedback}
                        className="py-3 cursor-pointer border-b border-gray-400/50 mx-6"
                    >
                        <div className="flex items-center gap-3">

                            {isFeedbackExpanded
                                ? <ChevronDown className="text-gray-400 w-4" />
                                : <ChevronRight className="text-gray-400 w-4" />}
                            <span className="font-semibold text-gray-700">Course Feedback</span>
                        </div>
                    </div>

                    {isFeedbackExpanded && (
                        <div className="ml-12 space-y-2 mt-2">

                            <Link
                                key={'feedback'}
                                to={`/learn/courses/${course.courseId}/feedback`}
                                className={`block py-2 px-4 rounded-lg text-sm ${isFeedbackActive()
                                    ? 'bg-blue-50 text-red-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-4 min-h-[2rem] w-full">
                                    <span className="line-clamp-2 flex-1 leading-5">Rating and Feedback</span>
                                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                        {!feedbackAcess && (
                                            <Lock className="w-4 h-4" />
                                        )}

                                    </div>
                                </div>
                            </Link>

                        </div>
                    )}
                </div>

            </div>

            <div className="mb-20"></div>
        </div>
    );
};

export default CourseSidebar;
