import React, { useState, useEffect } from "react";
import { fetchListModules } from "@/services/ModuleService";
import { fetchListCourses } from "@/services/CourseService";
import { fetchListTopics } from "@/services/TopicService";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import Select from "@/components/common/Select";
import TextEditor from "@/components/common/TextEditor";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonByLessonId, updateLesson, createLessons } from "@/services/LessonService";
import { convertBase64ToFile, saveFile } from "@/services/UtilsService";
import Input from "@/components/common/Input";

const LessonPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

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
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingContent, setLoadingContent] = useState(isEditing);

    // Fetch lesson data if editing
    useEffect(() => {
        if (isEditing) {
            setLoadingContent(true);
            getLessonByLessonId(id)
                .then(response => {
                    const { lesson, lessonContentId, content } = response;

                    let parsedContent = null;
                    try {
                        if (content) {
                            parsedContent = JSON.parse(content);
                        }
                    } catch (error) {
                        console.error("Error parsing content:", error);
                    }

                    setChosenLesson({
                        lessonId: lesson.lessonId || "",
                        lessonName: lesson.lessonName || "",
                        content: parsedContent,
                        moduleId: lesson.module?.moduleId ? String(lesson.module.moduleId) : "",
                        courseId: lesson.module?.course?.courseId ? String(lesson.module.course.courseId) : "",
                        topicId: lesson.module?.course?.topic?.topicId ? String(lesson.module.course.topic.topicId) : ""
                    });

                    // Fetch courses for the topic if it exists
                    if (lesson.module?.course?.topic?.topicId) {
                        const topicId = String(lesson.module.course.topic.topicId);
                        fetchListCourses(topicId)
                            .then(courses => {
                                setCourses(courses);
                                // After setting courses, fetch modules for the course
                                if (lesson.module?.course?.courseId) {
                                    const courseId = String(lesson.module.course.courseId);
                                    fetchListModules(courseId)
                                        .then(modules => {
                                            setModules(modules);
                                            setLoadingContent(false);
                                        })
                                        .catch(error => {
                                            console.error("Failed to fetch modules:", error);
                                            setLoadingContent(false);
                                        });
                                } else {
                                    setLoadingContent(false);
                                }
                            })
                            .catch(error => {
                                console.error("Failed to fetch courses:", error);
                                setLoadingContent(false);
                            });
                    } else {
                        setLoadingContent(false);
                    }
                })
                .catch(error => {
                    console.error("Failed to fetch lesson:", error);
                    setErrorMessage("Failed to load lesson data");
                    setLoadingContent(false);
                });
        }
    }, [id, isEditing]);

    // Fetch topics when page loads
    useEffect(() => {
        setLoadingPage(true);
        fetchListTopics()
            .then(items => {
                setTopics(items);
            })
            .catch(error => {
                console.error("Failed to fetch topics:", error);
                setErrorMessage("Failed to load topics");
            })
            .finally(() => {
                setLoadingTopics(false);
                setLoadingPage(false);
            });
    }, []);

    // Fetch courses when topic changes
    useEffect(() => {
        if (chosenLesson.topicId) {
            setLoadingCourses(true);

            // Don't clear courses when editing to avoid UI flicker
            if (!isEditing) {
                setCourses([]);
            }

            // Only reset courseId and moduleId if not in editing mode and manually changing
            if (!loadingPage && !isEditing) {
                setChosenLesson(prev => ({ ...prev, courseId: "", moduleId: "" }));
            }

            fetchListCourses(chosenLesson.topicId)
                .then(items => {
                    setCourses(items);
                })
                .catch(error => {
                    setErrorMessage("Failed to load courses");
                })
                .finally(() => setLoadingCourses(false));
        } else if (!isEditing) {
            // Only clear the fields if not in editing mode
            setCourses([]);
            setModules([]);
        }
    }, [chosenLesson.topicId, loadingPage, isEditing]);

    // Fetch modules when course changes
    useEffect(() => {
        if (chosenLesson.courseId) {
            setLoadingModules(true);

            // Don't clear modules when editing to avoid UI flicker
            if (!isEditing) {
                setModules([]);
            }

            // Only reset moduleId if not in editing mode and manually changing
            if (!loadingPage && !isEditing) {
                setChosenLesson(prev => ({ ...prev, moduleId: "" }));
            }

            fetchListModules(chosenLesson.courseId)
                .then(items => {
                    setModules(items);
                })
                .catch(error => {
                    console.error("Failed to fetch modules:", error);
                    setErrorMessage("Failed to load modules");
                })
                .finally(() => setLoadingModules(false));
        } else if (!isEditing) {
            // Only clear the modules if not in editing mode
            setModules([]);
        }
    }, [chosenLesson.courseId, loadingPage, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChosenLesson((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        const value = selectedOption ? selectedOption.value : "";
        setChosenLesson((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (newContent) => {
        setChosenLesson((prev) => ({ ...prev, content: newContent }));
    };

    const handleSave = async () => {
        if (!chosenLesson.lessonName.trim() || !chosenLesson.moduleId) {
            setErrorMessage("All fields are required!");
            return;
        }

        const processNode = async (node) => {
            try {
                // Kiểm tra node có tồn tại và có thuộc tính attrs không
                if (node?.type === 'resizableImage' && node.attrs?.isTemp) {
                    // Chuyển đổi Base64 thành file
                    const file = await convertBase64ToFile(node.attrs.src, node.attrs.fileInfo);

                    // Lưu file lên server và nhận URL mới
                    const response = await saveFile(file);

                    // Cập nhật URL và đánh dấu là không còn là file tạm
                    node.attrs.src = response.url;
                    node.attrs.isTemp = false;
                }

                // Xử lý đệ quy nếu node có content
                if (node?.content && Array.isArray(node.content)) {
                    for (const childNode of node.content) {
                        await processNode(childNode);
                    }
                }
            } catch (error) {
                console.error("Error processing node:", error);
                // Ném lỗi để xử lý ở cấp cao hơn
                throw error;
            }
        };

        try {
            // Kiểm tra và xử lý từng node trong content
            if (chosenLesson.content && chosenLesson.content.content && Array.isArray(chosenLesson.content.content)) {
                // Sử dụng Promise.all để xử lý song song (nếu cần)
                await Promise.all(chosenLesson.content.content.map(node => processNode(node)));
            }

            // Stringify content trước khi gửi lên server
            const contentToSave = chosenLesson.content ? JSON.stringify(chosenLesson.content) : null;

            // Tạo payload để gửi lên server
            const lessonToSave = {
                lessonId: chosenLesson.lessonId,
                lessonName: chosenLesson.lessonName,
                content: contentToSave,
                moduleId: chosenLesson.moduleId
            };

            // Gửi request lên server
            if (isEditing) {
                await updateLesson(lessonToSave);
            } else {
                await createLessons(lessonToSave);
            }

            // Điều hướng về trang danh sách bài học
            navigate("/admin/lessons");
        } catch (error) {
            console.error("Error saving lesson:", error);
            setErrorMessage(error.message || "Failed to save lesson");
        }
    };

    const handleCancel = () => {
        navigate("/admin/lessons");
    };

    // Compute the selected options for dropdowns
    const selectedTopicOption = chosenLesson.topicId ?
        topics.find(t => String(t.topicId) === String(chosenLesson.topicId)) : null;

    const selectedCourseOption = chosenLesson.courseId ?
        courses.find(c => String(c.courseId) === String(chosenLesson.courseId)) : null;

    const selectedModuleOption = chosenLesson.moduleId ?
        modules.find(m => String(m.moduleId) === String(chosenLesson.moduleId)) : null;

    return (
        <AdminLayout title={isEditing ? "Edit Lesson" : "Create Lesson"}>
            {loadingPage && !errorMessage ? (
                <div className="flex justify-center items-center py-10">
                    <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleCancel}
                            className="inline-flex items-center mr-4 text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Lessons
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {errorMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-12 gap-4">
                        {isEditing && (
                            <div className="col-span-2">
                                <Input
                                    label="Lesson ID:"
                                    value={chosenLesson.lessonId}
                                    className="bg-gray-200 cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                        )}

                        <div className={isEditing ? "col-span-10" : "col-span-12"}>
                            <Input
                                name="lessonName"
                                label="Lesson Name:"
                                value={chosenLesson.lessonName}
                                onChange={handleChange}
                                placeholder="Enter lesson name"
                            />
                        </div>

                        <div className="col-span-12">
                            <label className="text-gray-600 text-sm font-medium block mb-1">Topic:</label>
                            {loadingTopics ? (
                                <div className="flex items-center p-2">
                                    <LoaderCircle className="animate-spin w-5 h-5 text-gray-500" />
                                    <span className="ml-2">Loading topics...</span>
                                </div>
                            ) : (
                                <Select
                                    name="topicId"
                                    className="w-full z-12"
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
                            <label className="text-gray-600 text-sm font-medium block mb-1">Course:</label>
                            {loadingCourses ? (
                                <div className="flex items-center p-2">
                                    <LoaderCircle className="animate-spin w-5 h-5 text-gray-500" />
                                    <span className="ml-2">Loading courses...</span>
                                </div>
                            ) : (
                                <Select
                                    name="courseId"
                                    className="w-full z-11"
                                    value={selectedCourseOption ? {
                                        value: selectedCourseOption.courseId,
                                        label: selectedCourseOption.courseName
                                    } : null}
                                    onChange={(option) => handleSelectChange(option, { name: "courseId" })}
                                    options={courses.map((course) => ({
                                        value: course.courseId,
                                        label: course.courseName
                                    }))}
                                    isDisabled={!chosenLesson.topicId || courses.length === 0}
                                    isSearchable
                                    placeholder="Select a course"
                                />
                            )}
                        </div>

                        <div className="col-span-12">
                            <label className="text-gray-600 text-sm font-medium block mb-1">Module:</label>
                            {loadingModules ? (
                                <div className="flex items-center p-2">
                                    <LoaderCircle className="animate-spin w-5 h-5 text-gray-500" />
                                    <span className="ml-2">Loading modules...</span>
                                </div>
                            ) : (
                                <Select
                                    name="moduleId"
                                    className="w-full z-10"
                                    value={selectedModuleOption ? {
                                        value: selectedModuleOption.moduleId,
                                        label: selectedModuleOption.moduleName
                                    } : null}
                                    onChange={(option) => handleSelectChange(option, { name: "moduleId" })}
                                    options={modules.map((module) => ({
                                        value: module.moduleId,
                                        label: module.moduleName
                                    }))}
                                    isDisabled={!chosenLesson.courseId || modules.length === 0}
                                    isSearchable
                                    placeholder="Select a module"
                                />
                            )}
                        </div>

                        <div className="col-span-12">
                            <label className="text-gray-600 text-sm font-medium block mb-1">Content:</label>
                            {loadingContent ? (
                                <div className="h-96 border border-gray-300 rounded-lg flex justify-center items-center">
                                    <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                    <TextEditor
                                        content={chosenLesson.content}
                                        onContentChange={handleContentChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 pt-4 border-t space-x-3">
                        <button
                            onClick={handleCancel}
                            className="btn btn-ghost min-w-[100px]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none"
                        >
                            {isEditing ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default LessonPage;