import React, { useState, useEffect } from "react";
import Spinner from "@/components/common/Spinner";
import Table from "@/components/common/Table";
import AdminLayout from "@/components/layouts/AdminLayout";
import { deleteLessonByLessonId, fetchLessons } from "@/services/LessonService";
import { useNavigate } from "react-router-dom";

const AdminManageLessons = () => {
    const navigate = useNavigate();
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, size: 10, totalPages: 1, totalElements: 0 });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

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
        navigate("/admin/lessons/create");
    };

    const editButton = (lessonId) => {
        navigate(`/admin/lessons/edit/${lessonId}`);
    };

    const deleteButton = async (lessonId) => {
        try {
            await deleteLessonByLessonId(lessonId);
            const { meta, items } = await fetchLessons(paginationMeta.page, paginationMeta.size);

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

    useEffect(() => {
        fetchData(paginationMeta);
    }, []);

    return (
        <AdminLayout title="Manage Lessons">
            {loading ? (
                <Spinner height="h-[70vh]" />
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
                    deleteButton={deleteButton}
                />
            )}
        </AdminLayout>
    )
};

export default AdminManageLessons;