import React, { useState, useEffect } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { getCourseDetails } from "@/services/LearnService";
import Spinner from "@/components/common/Spinner";
import CourseSidebar from "@/components/common/CourseSidebar";
import ProgressBar from "@/components/common/ProgressBar";

const CourseLayout = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseData = await getCourseDetails(courseId);

                if (!courseData) {
                    throw new Error("Course not found");
                }

                setCourse(courseData);
            } catch (error) {
                // navigate("/learn");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <main className="flex">
                <CourseSidebar course={course} modules={course.modules} />
                <ProgressBar />
                <div className="ms-100 content w-full">
                    <Outlet context={{ course }} />
                </div>
            </main>
        </div>
    );
};

export default CourseLayout;
