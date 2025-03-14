import React, { useState, useEffect } from "react";
import { fetchListModules } from "@/services/ModuleService";
import { fetchListCourses } from "@/services/CourseService";
import { fetchListTopics } from "@/services/TopicService";
import { LoaderCircle } from "lucide-react";
import Select from "react-select";
import TextEditor from "@/components/common/TextEditor";

const LessonModal = ({ isOpen, onClose, onSave, lesson }) => {
    const [chosenLesson, setChosenLesson] = useState({
        lessonId: "",
        lessonName: "",
        content: null,
        moduleId: "",
        courseId: "",
        topicId: ""
    });

    const [topics, setTopics] = useState([]);
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingModules, setLoadingModules] = useState(false);
    const [loadingModal, setLoadingModal] = useState(true);

    // Fetch topics when modal opens
    useEffect(() => {
        if (isOpen) {
            setLoadingModal(true);
            fetchListTopics()
                .then(items => {
                    setTopics(items);

                    // If lesson has a topic through its module and course, ensure it's properly selected
                    if (lesson?.module?.course?.topic?.topicId) {
                        const topicId = String(lesson.module.course.topic.topicId);
                        setChosenLesson(prev => ({
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
    }, [isOpen, lesson]);

    // Initialize lesson data when editing or creating new
    useEffect(() => {
        if (lesson) {
            setChosenLesson({
                lessonId: lesson.lessonId || "",
                lessonName: lesson.lessonName || "",
                content: lesson.lessonContent.content ? JSON.parse(lesson.lessonContent.content) : null,
                moduleId: lesson.module ? String(lesson.module.moduleId) : "",
                courseId: lesson.module?.course ? String(lesson.module.course.courseId) : "",
                topicId: lesson.module?.course?.topic ? String(lesson.module.course.topic.topicId) : ""
            });
        } else {
            setChosenLesson({
                lessonId: "",
                lessonName: "",
                content: null,
                moduleId: "",
                courseId: "",
                topicId: ""
            });
        }
        setErrorMessage("");
    }, [lesson, isOpen]);

    // Handle body overflow
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        if (chosenLesson.topicId) {
            setLoadingCourses(true);
            setCourses([]);
            setChosenLesson(prev => ({ ...prev, courseId: "", moduleId: "" })); // Reset courseId and moduleId when topic changes

            fetchListCourses(chosenLesson.topicId)
                .then(items => {
                    setCourses(items);

                    // If we're editing a lesson, restore its course selection
                    if (lesson?.module?.course?.courseId &&
                        String(lesson.module.course.topic.topicId) === chosenLesson.topicId) {
                        setChosenLesson(prev => ({
                            ...prev,
                            courseId: String(lesson.module.course.courseId)
                        }));
                    }
                })
                .catch(error => console.error("Failed to fetch courses:", error))
                .finally(() => setLoadingCourses(false));
        } else {
            setCourses([]);
            setModules([]);
        }
    }, [chosenLesson.topicId, lesson]);

    // Fetch modules when course changes
    useEffect(() => {
        if (chosenLesson.courseId) {
            setLoadingModules(true);
            setModules([]); // Clear modules while loading
            setChosenLesson(prev => ({ ...prev, moduleId: "" })); // Reset moduleId when course changes

            fetchListModules(chosenLesson.courseId)
                .then(items => {
                    setModules(items);

                    // If we're editing a lesson, restore its module selection
                    if (lesson?.module?.moduleId &&
                        String(lesson.module.course.courseId) === chosenLesson.courseId) {
                        setChosenLesson(prev => ({
                            ...prev,
                            moduleId: String(lesson.module.moduleId)
                        }));
                    }
                })
                .catch(error => console.error("Failed to fetch modules:", error))
                .finally(() => setLoadingModules(false));
        } else {
            setModules([]);
        }
    }, [chosenLesson.courseId, lesson]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChosenLesson((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        const value = selectedOption ? selectedOption.value : "";

        setChosenLesson((prev) => {
            const newState = { ...prev, [name]: value };
            console.log("New state:", newState);
            return newState;
        });
    };

    const handleContentChange = (newContent) => {
        setChosenLesson((prev) => ({ ...prev, content: newContent }));
    };

    const handleSave = async () => {
        if (!chosenLesson.lessonName.trim() || !chosenLesson.moduleId) {
            setErrorMessage("All fields are required!");
            return;
        }

        try {
            // Send only the necessary data to the server
            const lessonToSave = {
                lessonId: chosenLesson.lessonId,
                lessonName: chosenLesson.lessonName,
                content: chosenLesson.content,
                moduleId: chosenLesson.moduleId
            };

            console.log("Saving lesson with data:", lessonToSave);
            await onSave(lessonToSave);
            onClose();
        } catch (error) {
            setErrorMessage(error.message || "Failed to save lesson");
        }
    };

    // Compute the selected options for dropdowns
    const selectedTopicOption = chosenLesson.topicId ?
        topics.find(t => String(t.topicId) === String(chosenLesson.topicId)) : null;

    const selectedCourseOption = chosenLesson.courseId ?
        courses.find(c => String(c.courseId) === String(chosenLesson.courseId)) : null;

    const selectedModuleOption = chosenLesson.moduleId ?
        modules.find(m => String(m.moduleId) === String(chosenLesson.moduleId)) : null;

    return isOpen ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black-200 bg-opacity-50 z-100">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-4xl z-10 relative max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{lesson ? "Edit Lesson" : "Create Lesson"}</h2>

                {loadingModal ? (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-12 gap-4">
                            {lesson?.lessonId && (
                                <div className="col-span-2">
                                    <label className="text-gray-600 text-sm font-medium">Lesson ID:</label>
                                    <input
                                        type="text"
                                        value={chosenLesson.lessonId}
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            )}

                            <div className={lesson?.lessonId ? "col-span-10" : "col-span-12"}>
                                <label className="text-gray-600 text-sm font-medium">Lesson Name:</label>
                                <input
                                    type="text"
                                    name="lessonName"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter lesson name"
                                    value={chosenLesson.lessonName}
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
                                        placeholder={chosenLesson.topicId ? (courses.length > 0 ? "Select a course" : "No course found!") : "Please select a topic"}
                                        isDisabled={!chosenLesson.topicId || courses.length === 0}
                                    />
                                )}
                            </div>

                            <div className="col-span-12">
                                <label className="text-gray-600 text-sm font-medium">Module:</label>
                                {loadingModules ? (
                                    <div className="flex items-center p-2">
                                        <LoaderCircle className="animate-spin w-5 h-5 text-gray-500" />
                                        <span className="ml-2">Loading modules...</span>
                                    </div>
                                ) : (
                                    <Select
                                        name="moduleId"
                                        className="w-full"
                                        value={selectedModuleOption ? {
                                            value: selectedModuleOption.moduleId,
                                            label: selectedModuleOption.moduleName
                                        } : null}
                                        onChange={(option) => handleSelectChange(option, { name: "moduleId" })}
                                        options={modules.map((module) => ({
                                            value: module.moduleId,
                                            label: module.moduleName
                                        }))}
                                        isSearchable
                                        placeholder={chosenLesson.courseId ? (courses.length > 0 ? "Select a module" : "No module found!") : "Please select a course"}
                                        isDisabled={!chosenLesson.courseId || modules.length === 0}
                                    />
                                )}
                            </div>

                            <div className="col-span-12">
                                <label className="text-gray-600 text-sm font-medium">Content:</label>
                                <TextEditor content={chosenLesson.content} onContentChange={handleContentChange} />
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
                                {lesson ? "Update" : "Create"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    ) : null;
};

export default LessonModal;