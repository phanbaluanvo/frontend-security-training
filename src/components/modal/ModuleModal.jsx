import React, { useState, useEffect } from "react";
import { fetchListCourses } from "@/services/CourseService";
import { fetchListTopics } from "@/services/TopicService";
import { LoaderCircle } from "lucide-react";
import Select from "@/components/common/Select";
import Input from "@/components/common/Input";

const ModuleModal = ({ isOpen, onClose, onSave, module }) => {
    const [chosenModule, setChosenModule] = useState({ moduleId: "", moduleName: "", description: "", courseId: "", topicId: "" });
    const [topics, setTopics] = useState([]);
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingModal, setLoadingModal] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoadingModal(true);
            fetchListTopics()
                .then(items => {
                    setTopics(items);

                    if (module?.course?.topic?.topicId) {
                        const topicId = String(module.course.topic.topicId);
                        setChosenModule(prev => ({
                            ...prev,
                            topicId: topicId
                        }));
                    }
                })
                .catch(error => console.error("Failed to fetch topics:", error))
                .finally(() => {
                    setLoadingTopics(false);
                    setLoadingModal(false);
                });
        }
    }, [isOpen, module]);

    useEffect(() => {
        if (module) {
            setChosenModule({
                moduleId: module.moduleId || "",
                moduleName: module.moduleName || "",
                description: module.description || "",
                courseId: module.course ? String(module.course.courseId) : "",
                topicId: module.course?.topic ? String(module.course.topic.topicId) : ""
            });
        } else {
            setChosenModule({ moduleId: "", moduleName: "", description: "", courseId: "", topicId: "" });
        }
        setErrorMessage("");
    }, [module, isOpen]);

    useEffect(() => {
        if (chosenModule.topicId) {
            setLoadingCourses(true);
            setCourses([]);
            setChosenModule(prev => ({ ...prev, courseId: "" }));

            fetchListCourses(chosenModule.topicId)
                .then(items => {
                    setCourses(items);

                    if (module?.course?.courseId && String(module.course.topic.topicId) === chosenModule.topicId) {
                        setChosenModule(prev => ({
                            ...prev,
                            courseId: String(module.course.courseId)
                        }));
                    }
                })
                .catch(error => console.error("Failed to fetch courses:", error))
                .finally(() => setLoadingCourses(false));
        } else {
            setCourses([]);
        }
    }, [chosenModule.topicId, module]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChosenModule((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        const value = selectedOption ? selectedOption.value : "";

        setChosenModule((prev) => {
            const newState = { ...prev, [name]: value };
            return newState;
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!chosenModule.moduleName.trim() || !chosenModule.courseId) {
            setErrorMessage("All fields are required!");
            return;
        }

        try {
            setActionLoading(true);
            await onSave(chosenModule);
            document.getElementById('module_modal').close();
            onClose();
        } catch (error) {
            setErrorMessage(error.message || "Failed to save module");
        } finally {
            setActionLoading(false);
        }
    };

    // Compute the selected topic and course options
    const selectedTopicOption = chosenModule.topicId ?
        topics.find(t => String(t.topicId) === String(chosenModule.topicId)) : null;

    const selectedCourseOption = chosenModule.courseId ?
        courses.find(c => String(c.courseId) === String(chosenModule.courseId)) : null;

    // Debug log for selections
    console.log("Current selections:", {
        topicId: chosenModule.topicId,
        courseId: chosenModule.courseId,
        selectedTopicOption,
        selectedCourseOption,
        availableCourses: courses.length
    });

    // Nếu modal đang mở, hiển thị nó
    if (isOpen) {
        document.getElementById('module_modal').showModal();
    }

    return (
        <dialog id="module_modal" className="modal">
            <div className="modal-box max-w-[65vw] overflow-y-visible">
                {loadingModal ? (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4">
                            {module ? "Edit Module" : "Create Module"}
                        </h2>
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-12 gap-4">
                                {module?.moduleId && (
                                    <div className="col-span-2">
                                        <Input
                                            name="moduleId"
                                            label="Module ID:"
                                            value={chosenModule.moduleId}
                                            className="bg-gray-200"
                                            readOnly
                                        />
                                    </div>
                                )}
                                <div className={module?.moduleId ? "col-span-10" : "col-span-12"}>
                                    <Input
                                        name="moduleName"
                                        label="Module Name:"
                                        value={chosenModule.moduleName}
                                        onChange={handleChange}
                                        placeholder="Enter module name"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <label className="text-gray-600 text-sm font-medium">Description:</label>
                                    <textarea
                                        name="description"
                                        className="w-full p-2 border border-gray-300 rounded-sm focus:ring-0 focus:ring-grey-500 input min-h-[10vh]"
                                        placeholder="Enter description"
                                        value={chosenModule.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <label className="text-gray-600 text-sm font-medium">Topic:</label>
                                    {loadingTopics ? (
                                        <div className="flex items-center p-2">
                                            <LoaderCircle className="animate-spin w-5 h-5 text-gray-500" />
                                            <span className="ml-2">Loading topics...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            name="topicId"
                                            value={selectedTopicOption ? {
                                                value: selectedTopicOption.topicId,
                                                label: selectedTopicOption.topicName
                                            } : null}
                                            onChange={(option) => handleSelectChange(option, { name: "topicId" })}
                                            options={topics.map((topic) => ({
                                                value: topic.topicId,
                                                label: topic.topicName
                                            }))}
                                            isSearchable
                                            placeholder="Select a topic"
                                        />
                                    )}
                                </div>
                                <div className="col-span-12">
                                    <label className="text-gray-600 text-sm font-medium">Course:</label>
                                    {loadingCourses ? (
                                        <div className="flex items-center p-2">
                                            <LoaderCircle className="animate-spin w-5 h-5 text-gray-500" />
                                            <span className="ml-2">Loading courses...</span>
                                        </div>
                                    ) : (
                                        <Select
                                            name="courseId"
                                            value={selectedCourseOption ? {
                                                value: selectedCourseOption.courseId,
                                                label: selectedCourseOption.courseName
                                            } : null}
                                            onChange={(option) => handleSelectChange(option, { name: "courseId" })}
                                            options={courses.map((course) => ({
                                                value: course.courseId,
                                                label: course.courseName
                                            }))}
                                            isSearchable
                                            placeholder={chosenModule.topicId ? "Select a course" : "Please select a topic first"}
                                            isDisabled={!chosenModule.topicId || courses.length === 0}
                                        />
                                    )}
                                </div>

                                {errorMessage && (
                                    <p className="text-red-500 text-sm italic mt-1 col-span-12">{errorMessage}</p>
                                )}
                            </div>

                            <div className="modal-action mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById('module_modal').close();
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
                                        module ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default ModuleModal;