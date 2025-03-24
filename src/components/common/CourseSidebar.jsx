import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CourseSidebar = ({ course, modules }) => {
    const [expandedModules, setExpandedModules] = useState(new Set());
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

    const isLessonActive = (lessonId) => {
        return location.pathname.includes(`/lessons/${lessonId}`);
    };

    useEffect(() => {
        if (modules?.length) {
            setExpandedModules(new Set(modules.map((module) => module.moduleId)));
        }
    }, [modules]);

    return (
        <div className="bg-gray-200 w-90 h-screen overflow-y-auto fixed left-0">
            {/* Course Header */}
            <div className="p-6 bg-red-800 text-white w-full">
                <header className="text-4xl font-bold mb-12">{course?.courseName}</header>
                <div className="text-white mb-2">
                    <div className="w-full bg-gray-500 h-2 mb-1">
                        <div className="bg-white h-2" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-md">20% COMPLETED</span>
                </div>
            </div>

            {/* Modules List */}
            <div className="py-4">
                {modules?.map((module) => (
                    <div key={module.moduleId} className="mb-2">
                        {/* Module Header */}
                        <div
                            onClick={() => toggleModule(module.moduleId)}
                            className="py-3 cursor-pointer border-b  border-gray-400/50 mx-6"
                        >
                            <div className="flex items-center gap-3">
                                {expandedModules.has(module.moduleId)
                                    ? <ChevronDown className="text-gray-400 w-4" />
                                    : <ChevronRight className="text-gray-400 w-4" />
                                }
                                <span className="font-medium text-gray-700">{module.moduleName}</span>
                            </div>
                        </div>

                        {/* Lessons List */}
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
                                        <div className="flex items-center gap-4 min-h-[2rem]">
                                            <span className="line-clamp-2 flex-1 leading-5">{lesson.lessonName}</span>
                                            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                                {lesson.complete && (
                                                    <FontAwesomeIcon
                                                        icon={faCircleCheck}
                                                        className="text-red-500 text-lg"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseSidebar;