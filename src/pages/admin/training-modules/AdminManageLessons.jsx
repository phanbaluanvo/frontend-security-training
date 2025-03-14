import React, { useState, useEffect } from "react";
import Spinner from "@/components/common/Spinner";
import Table from "@/components/common/Table";
import TextEditor from "@/components/common/TextEditor";
import AdminLayout from "@/components/layouts/AdminLayout";
import { createLessons, fetchLessons, getLessonByLessonId, updateLesson } from "@/services/LessonService";
import LessonModal from "@/components/modal/LessonModal";

const AdminManageLessons = () => {
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, size: 10, totalPages: 1, totalElements: 0 });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);


    const fetchData = async (paginationMeta) => {
        try {
            const { meta, items } = await fetchLessons(paginationMeta.page, paginationMeta.size);
            setPaginationMeta(meta);
            setItems(items);
        } catch (error) {
            console.error("Failed to load lesson data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPaginationMeta((prev) => ({ ...prev, page: newPage }));
        fetchData({ ...paginationMeta, page: newPage });
    };

    const createNewButton = () => {
        setSelectedLesson(null);
        setModalOpen(true);
    };

    const editButton = async (lessonId) => {
        setModalOpen(true);
        setSelectedLesson(null);

        try {
            const lessonData = await getLessonByLessonId(lessonId);
            setSelectedLesson(lessonData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const handleSave = async (lesson) => {
        try {
            if (selectedLesson) {
                await updateLesson(lesson);
            } else {
                await createLessons(lesson);
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
        <AdminLayout title="Manage Lessons">
            {loading ? (
                <Spinner />
            ) : (
                <Table
                    title="Lessons List"
                    headers={["Lesson ID", "Lesson Name", "Module ID", "Module Name"]}
                    items={items}
                    meta={paginationMeta}
                    keys={["lessonId", "lessonName", "module.moduleId", "module.moduleName"]}
                    handlePageChange={handlePageChange}
                    createNewButton={createNewButton}
                    editButton={editButton}
                    deleteButton={null}
                />
            )}

            <LessonModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                lesson={selectedLesson}
            />
        </AdminLayout>
    )
};

export default AdminManageLessons;