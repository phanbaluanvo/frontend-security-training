import React, { useState, useEffect } from "react";
import { fetchListTopics } from "@/services/TopicService";
import { LoaderCircle } from 'lucide-react';
import Select from "react-select";

const CourseModal = ({ isOpen, onClose, onSave, course }) => {
    const [chosenCourse, setChosenCourse] = useState({ courseId: "", courseName: "", description: "", topicId: "" });
    const [topics, setTopics] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsFetching(true);
            const fetchTopics = async () => {
                try {
                    const items = await fetchListTopics();
                    setTopics(items);

                    if (course?.topic?.topicId) {
                        const topicId = String(course.topic.topicId);
                        setChosenCourse(prev => ({
                            ...prev,
                            topicId: topicId
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch topics:", error);
                } finally {
                    setIsFetching(false);
                }
            };

            fetchTopics();
        }
    }, [isOpen, course]);

    useEffect(() => {
        if (course) {
            setChosenCourse({
                courseId: course.courseId || "",
                courseName: course.courseName || "",
                description: course.description || "",
                topicId: course.topic?.topicId ? String(course.topic.topicId) : ""
            });
        } else {
            setChosenCourse({ courseId: "", courseName: "", description: "", topicId: "" });
        }
        setErrorMessage("");
    }, [course, isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChosenCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!chosenCourse.courseName.trim() || !chosenCourse.topicId) {
            setErrorMessage("All fields are required!");
            return;
        }

        setLoading(true);

        try {
            await onSave(chosenCourse);
            onClose();
        } catch (error) {
            setErrorMessage(error.message || "Failed to save course");
        } finally {
            setLoading(false);
        }
    };

    // Compute the selected topic option for the Select component
    const selectedTopicOption = chosenCourse.topicId ?
        topics.find(t => String(t.topicId) === String(chosenCourse.topicId)) : null;

    const topicValue = selectedTopicOption ? {
        value: selectedTopicOption.topicId,
        label: selectedTopicOption.topicName
    } : null;

    return isOpen ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black-200 bg-opacity-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-4xl z-10 relative">
                <h2 className="text-xl font-semibold mb-4">
                    {course ? "Edit Course" : "Create Course"}
                </h2>

                {isFetching || (!chosenCourse.courseName && course) ? (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-12 gap-4">
                            {course?.courseId && (
                                <div className="col-span-2">
                                    <label className="text-gray-600 text-sm font-medium">Course ID:</label>
                                    <input
                                        type="text"
                                        value={chosenCourse.courseId}
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            )}

                            <div className={course?.courseId ? "col-span-10" : "col-span-12"}>
                                <label className="text-gray-600 text-sm font-medium">Course Name:</label>
                                <input
                                    type="text"
                                    name="courseName"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter course name"
                                    value={chosenCourse.courseName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-span-12">
                                <label className="text-gray-600 text-sm font-medium">Description:</label>
                                <textarea
                                    name="description"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter description"
                                    value={chosenCourse.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-span-12">
                                <label className="text-gray-600 text-sm font-medium">Topic:</label>
                                <Select
                                    name="topicId"
                                    className="w-full"
                                    value={topicValue}
                                    onChange={(selectedOption) => {
                                        setChosenCourse((prev) => ({
                                            ...prev,
                                            topicId: selectedOption ? selectedOption.value : ""
                                        }));
                                    }}
                                    options={topics.map((topic) => ({
                                        value: topic.topicId,
                                        label: topic.topicName,
                                    }))}
                                    isSearchable
                                    placeholder="Select a topic"
                                />
                            </div>

                            {errorMessage && (
                                <p className="text-red-500 text-sm italic mt-1 col-span-12">{errorMessage}</p>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                disabled={loading}
                            >
                                Close
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 flex items-center justify-center w-32"
                                disabled={loading}
                            >
                                {loading ? <LoaderCircle className="animate-spin w-5 h-5" /> : course ? "Update" : "Create"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    ) : null;
};

export default CourseModal;