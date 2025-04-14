import React, { useState, useEffect } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { getCourseDetails, markLessonComplete, markCourseComplete } from "@/services/LearnService";
import { getActiveQuizForCourse } from "@/services/QuizService";
import Spinner from "@/components/common/Spinner";
import CourseSidebar from "@/components/common/CourseSidebar";

const CourseLayout = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [totalLessons, setTotalLessons] = useState(0);
    const [completedLessons, setCompletedLessons] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [feedbackAccess, setFeedbackAccess] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (course) return;

            try {
                const courseData = await getCourseDetails(courseId);
                const quizData = await getActiveQuizForCourse(courseId);

                if (!courseData) throw new Error("Course not found");

                setCourse(courseData);
                setQuizzes(Array.isArray(quizData) ? quizData : []);

                const allLessons = courseData.modules.flatMap((mod) => mod.lessons);
                const lessonsCompletedCount = allLessons.filter((l) => l.complete).length;

                const quizIsDone = courseData.complete === true;
                setQuizCompleted(quizIsDone);
                setFeedbackAccess(courseData.complete); // <-- ✅ Gán quyền truy cập feedback nếu khóa học đã hoàn thành

                setTotalLessons(allLessons.length + 1); // +1 cho phần Quiz
                setCompletedLessons(lessonsCompletedCount + (quizIsDone ? 1 : 0));
            } catch (error) {
                console.error("Error loading course:", error);
                navigate("/learn");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, course, navigate]);

    const markLessonAsComplete = async (lessonId) => {
        if (!course) return;

        const alreadyCompleted = course.modules
            .flatMap((mod) => mod.lessons)
            .find((les) => les.lessonId === lessonId)?.complete;

        if (alreadyCompleted) return;

        try {
            setCourse((prev) => {
                const updatedModules = prev.modules.map((mod) => ({
                    ...mod,
                    lessons: mod.lessons.map((les) =>
                        les.lessonId === lessonId ? { ...les, complete: true } : les
                    ),
                }));

                setCompletedLessons((prev) => prev + 1);
                return { ...prev, modules: updatedModules };
            });

            await markLessonComplete(lessonId, courseId, true);
        } catch (error) {
            console.error("Error updating lesson status:", error);
        }
    };

    const handleQuizComplete = async () => {
        if (quizCompleted || !course) return;

        try {
            await markCourseComplete(courseId);
            setQuizCompleted(true);
            setFeedbackAccess(true);
            setCourse((prev) => ({ ...prev, complete: true }));
        } catch (error) {
            console.error("Error completing course:", error);
        }
    };

    const completePercentage =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const quizAccess = completedLessons >= totalLessons - 1;

    const courseComplete = course?.complete || false;

    const lessonIds = course?.modules.reduce((ids, module) => {
        module.lessons.forEach(lesson => {
            ids.push(lesson.lessonId);
        });
        return ids;
    }, []);

    const quizId = quizzes[0]?.quizId;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (!course) {
        return <div>Error: Course not found.</div>;
    }

    return (
        <div className="flex flex-col w-full">
            <main className="flex">
                <CourseSidebar
                    course={course}
                    modules={course.modules}
                    quizzes={quizzes}
                    completePercentage={completePercentage}
                    quizAccess={quizAccess}
                    feedbackAcess={feedbackAccess} // <-- đảm bảo đúng props spelling
                />
                <div className="ms-100 content w-full">
                    <Outlet context={{
                        markLessonAsComplete,
                        handleQuizComplete,
                        quizAccess,
                        courseComplete,
                        lessonIds,
                        quizId,
                        feedbackAccess // <-- pass đúng context
                    }} />
                </div>
            </main>
        </div>
    );
};

export default CourseLayout;
