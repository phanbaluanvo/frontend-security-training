import React, { useState, useEffect } from 'react';
import { useParams, Routes, Route, Outlet } from 'react-router-dom';
import CourseSidebar from '@/components/common/CourseSidebar';
import LessonContent from './LessonContent';
import { getCourseDetails } from '@/services/LearnService'; // Import hàm gọi API
import Spinner from '@/components/common/Spinner';

const CourseView = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseData = await getCourseDetails(courseId);

                console.log(courseData);
                setCourse(courseData);
                setModules(courseData.modules);
            } catch (error) {
                console.error('Error fetching course data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

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
                <CourseSidebar course={course} modules={modules} />
                <div className='ms-100 content w-full'>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CourseView;