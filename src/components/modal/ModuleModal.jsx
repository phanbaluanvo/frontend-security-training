import React, { useState, useEffect } from "react";
import { fetchListCourses } from "@/services/CourseService";
import { fetchListTopics } from "@/services/TopicService";
import { LoaderCircle } from "lucide-react";
import Select from "react-select";

const ModuleModal = ({ isOpen, onClose, onSave, module }) => {
    const [chosenModule, setChosenModule] = useState({ moduleId: "", moduleName: "", description: "", courseId: "", topicId: "" });
    const [topics, setTopics] = useState([]);
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingModal, setLoadingModal] = useState(true);

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

        // Debug log
        console.log(`Select changed: ${name} = ${value}`);

        setChosenModule((prev) => {
            const newState = { ...prev, [name]: value };
            console.log("New state:", newState);
            return newState;
        });
    };

    const handleSave = async () => {
        if (!chosenModule.moduleName.trim() || !chosenModule.courseId) {
            setErrorMessage("All fields are required!");
            return;
        }

        console.log("Saving module with data:", chosenModule);

        try {
            await onSave(chosenModule);
            onClose();
        } catch (error) {
            setErrorMessage(error.message || "Failed to save module");
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

    return isOpen ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black-200 bg-opacity-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-4xl z-10 relative">
                <h2 className="text-xl font-semibold mb-4">
                    {module ? "Edit Module" : "Create Module"}
                </h2>

                {loadingModal ? (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-12 gap-4">
                            {module?.moduleId && (
                                <div className="col-span-2">
                                    <label className="text-gray-600 text-sm font-medium">Module ID:</label>
                                    <input
                                        type="text"
                                        value={chosenModule.moduleId}
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            )}
                            <div className={module?.moduleId ? "col-span-10" : "col-span-12"}>
                                <label className="text-gray-600 text-sm font-medium">Module Name:</label>
                                <input
                                    type="text"
                                    name="moduleName"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter module name"
                                    value={chosenModule.moduleName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-12">
                                <label className="text-gray-600 text-sm font-medium">Description:</label>
                                <textarea
                                    name="description"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full"
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
                                        className="w-full"
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

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                            >
                                Close
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 flex items-center justify-center w-32"
                            >
                                {module ? "Update" : "Create"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    ) : null;
};

export default ModuleModal;