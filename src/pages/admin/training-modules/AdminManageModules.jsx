import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Table from "@/components/common/Table";
import { createModule, deleteModuleByModuleId, fetchModules, getModuleByModuleId, updateModule } from "@/services/ModuleService";
import Spinner from "@/components/common/Spinner";
import ModuleModal from "@/components/modal/ModuleModal";

const AdminManageModules = () => {
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, size: 10, totalPages: 1, totalElements: 0 });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);

    const fetchData = async (paginationMeta) => {
        try {
            const { meta, items } = await fetchModules(paginationMeta.page, paginationMeta.size);
            setPaginationMeta(meta);
            setItems(items);
        } catch (error) {
            console.error("Failed to load module data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPaginationMeta((prev) => ({ ...prev, page: newPage }));
        fetchData({ ...paginationMeta, page: newPage });
    };

    const createNewButton = () => {
        setSelectedModule(null);
        setModalOpen(true);
    };

    const editButton = async (moduleId) => {

        setModalOpen(true);
        setSelectedModule(null);

        try {
            const moduleData = await getModuleByModuleId(moduleId);
            setSelectedModule(moduleData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const deleteButton = async (moduleId) => {
        try {
            await deleteModuleByModuleId(moduleId);
            const { meta, items } = await fetchModules(paginationMeta.page, paginationMeta.size);

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

    const handleSave = async (module) => {
        try {
            if (selectedModule) {
                await updateModule(module);
            } else {
                await createModule(module);
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
        <AdminLayout title="Manage Modules">
            {loading ? (
                <Spinner />
            ) : (
                <Table
                    title="Modules List"
                    headers={["Module ID", "Module Name", "Description", "Course ID", "Course Name", "Created By"]}
                    items={items}
                    meta={paginationMeta}
                    keys={["moduleId", "moduleName", "description", "course.courseId", "course.courseName", "createdBy"]}
                    handlePageChange={handlePageChange}
                    createNewButton={createNewButton}
                    editButton={editButton}
                    deleteButton={deleteButton}
                />
            )}

            {/* Modal */}
            <ModuleModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                module={selectedModule}
            />
        </AdminLayout>
    );
};

export default AdminManageModules;