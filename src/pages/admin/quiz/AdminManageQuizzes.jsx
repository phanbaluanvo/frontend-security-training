import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";
import { fetchCourses, deleteCourseByCourseId, getCourseByCourseId, updateCourse, createCourse } from "@/services/CourseService";
import CourseModal from "@/components/modal/CourseModal";
import { Link } from "react-router-dom";

const AdminManageQuizzes = () => {
    const [courses, setCourses] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, size: 10, totalPages: 1, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const fetchData = async (page, size) => {
        try {
            setLoading(true);
            const { meta, items } = await fetchCourses(page, size);
            setPaginationMeta(meta);
            setCourses(items);
        } catch (error) {
            console.error("Failed to load course data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchData(newPage, paginationMeta.size);
    };

    useEffect(() => {
        fetchData(paginationMeta.page, paginationMeta.size);
    }, []);

    return (
        <AdminLayout title="Manage Quizzes">
            {loading ? (
                <Spinner height="h-[70vh]" />
            ) : (
                <div className="flex flex-col items-center">
                    <ul className="list bg-base-100 rounded-box shadow-md w-[80vw]">
                        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Choose a course to see quiz assigned</li>

                        {courses.map((course, index) => (
                            <Link key={course.courseId} to={`/admin/quizzes/courses/${course.courseId}`}>
                                <li className="list-row hover:bg-gray-100 cursor-pointer">
                                    <div className="text-4xl font-thin opacity-30 tabular-nums">
                                        {String(index + 1 + (paginationMeta.page - 1) * paginationMeta.size).padStart(2, "0")}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{course.courseName}</div>
                                        <div className="text-xs uppercase font-semibold opacity-60">
                                            {course.topic?.topicName}
                                        </div>
                                    </div>
                                    <p className="list-col-wrap text-xs w-[50vw]">
                                        {course.description || "No description available."}
                                    </p>
                                </li>
                            </Link>
                        ))}
                    </ul>

                    {/* Pagination Component */}
                    <Pagination meta={paginationMeta} onPageChange={handlePageChange} />
                </div>
            )
            }
        </AdminLayout >
    );
};

export default AdminManageQuizzes;
