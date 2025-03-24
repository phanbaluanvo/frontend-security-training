import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Table from "@/components/common/Table";
import { createCourse, deleteCourseByCourseId, fetchCourses, getCourseByCourseId, updateCourse } from "@/services/CourseService";
import Spinner from "@/components/common/Spinner";
import CourseModal from "@/components/modal/CourseModal";

const AdminManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, size: 10, totalPages: 1, totalElements: 0 });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const fetchData = async (paginationMeta) => {
        try {
            const { meta, items } = await fetchCourses(paginationMeta.page, paginationMeta.size);
            setPaginationMeta(meta);
            setItems(items);
        } catch (error) {
            console.error("Failed to load course data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPaginationMeta((prev) => ({ ...prev, page: newPage }));
        fetchData({ ...paginationMeta, page: newPage });
    };

    const createNewButton = () => {
        setSelectedCourse(null);
        setModalOpen(true);
    };

    const editButton = async (courseId) => {
        setModalOpen(true);
        setSelectedCourse(null);

        try {
            const courseData = await getCourseByCourseId(courseId);
            setSelectedCourse(courseData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const deleteButton = async (courseId) => {
        try {
            await deleteCourseByCourseId(courseId);
            const { meta, items } = await fetchCourses(paginationMeta.page, paginationMeta.size);

            if (items.length === 0 && paginationMeta.page > 1) {
                handlePageChange(paginationMeta.page - 1);
            } else {
                setPaginationMeta(meta);
                setItems(items);
            }
        } catch (error) {
            console.error("Error: ", error.message);
        }
    };

    const handleSave = async (course) => {
        try {
            if (selectedCourse) {
                await updateCourse(course);
            } else {
                await createCourse(course);
            }
            setModalOpen(false);
            fetchData(paginationMeta);
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        fetchData(paginationMeta);
    }, []);

    return (
        <AdminLayout title="Manage Courses">
            {loading ? (
                <Spinner height="h-[70vh]" />
            ) : (
                <Table
                    title="Courses List"
                    headers={["Course ID", "Course Name", "Description", "Topic ID", "Topic Name", "Created By"]}
                    items={items}
                    meta={paginationMeta}
                    keys={["courseId", "courseName", "description", "topic.topicId", "topic.topicName", "createdBy"]}
                    handlePageChange={handlePageChange}
                    createNewButton={createNewButton}
                    editButton={editButton}
                    deleteButton={deleteButton}
                />
            )}

            {/* Modal */}
            <CourseModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                course={selectedCourse}
            />
        </AdminLayout>
    );
};

export default AdminManageCourses;
