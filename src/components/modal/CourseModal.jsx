import React, { useState, useEffect } from "react";
import { fetchListTopics } from "@/services/TopicService";
import { LoaderCircle } from 'lucide-react';
import Select from "@/components/common/Select";
import Input from "@/components/common/Input";

const CourseModal = ({ isOpen, onClose, onSave, course }) => {
    const [chosenCourse, setChosenCourse] = useState({ courseId: "", courseName: "", description: "", topicId: "" });
    const [topics, setTopics] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

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

    const handleSave = async (e) => {
        e.preventDefault();
        if (!chosenCourse.courseName.trim() || !chosenCourse.topicId) {
            setErrorMessage("All fields are required!");
            return;
        }

        try {
            setActionLoading(true);
            await onSave(chosenCourse);
            document.getElementById('course_modal').close();
            onClose();
        } catch (error) {
            setErrorMessage(error.message || "Failed to save course");
        } finally {
            setActionLoading(false);
        }
    };

    // Compute the selected topic option for the Select component
    const selectedTopicOption = chosenCourse.topicId ?
        topics.find(t => String(t.topicId) === String(chosenCourse.topicId)) : null;

    const topicValue = selectedTopicOption ? {
        value: selectedTopicOption.topicId,
        label: selectedTopicOption.topicName
    } : null;

    // Nếu modal đang mở, hiển thị nó
    if (isOpen) {
        document.getElementById('course_modal').showModal();
    }

    return (
        <dialog id="course_modal" className="modal">
            <div className="modal-box max-w-[65vw] overflow-y-visible">
                {isFetching || (!chosenCourse.courseName && course) ? (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4">
                            {course ? "Edit Course" : "Create Course"}
                        </h2>
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-12 gap-4">
                                {course?.courseId && (
                                    <div className="col-span-2">
                                        <Input
                                            name="courseId"
                                            label="Course ID:"
                                            value={chosenCourse.courseId}
                                            className="bg-gray-200"
                                            readOnly
                                        />
                                    </div>
                                )}

                                <div className={course?.courseId ? "col-span-10" : "col-span-12"}>
                                    <Input
                                        name="courseName"
                                        label="Course Name:"
                                        value={chosenCourse.courseName}
                                        onChange={handleChange}
                                        placeholder="Enter course name"
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

                                <div className="col-span-12">
                                    <label className="text-gray-600 text-sm font-medium">Description:</label>
                                    <textarea
                                        name="description"
                                        className="w-full p-2 border border-gray-300 rounded-sm focus:ring-0 focus:ring-grey-500 input min-h-[10vh]"
                                        placeholder="Enter description"
                                        value={chosenCourse.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* <div className="col-span-12 p-0">
                                    <label className="text-gray-600 text-sm font-medium">Banner Image</label>
                                    <input
                                        type="file"
                                        class="w-full file:mr-4 file:rounded-full file:border-0 file:bg-red-700 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-red-800"
                                    />
                                </div> */}

                                {errorMessage && (
                                    <p className="text-red-500 text-sm italic mt-1 col-span-12">{errorMessage}</p>
                                )}
                            </div>

                            <div className="modal-action mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById('course_modal').close();
                                        onClose();
                                    }}
                                    className="btn btn-ghost min-w-[100px]"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <LoaderCircle className="animate-spin w-5 h-5" /> :
                                        course ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog >
    );
};

export default CourseModal;
