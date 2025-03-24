import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Table from "@/components/common/Table";
import { createTopic, deleteTopicByTopicId, fetchTopics, getTopicByTopicId, updateTopic } from "@/services/TopicService";
import Spinner from "@/components/common/Spinner";
import TopicModal from "@/components/modal/TopicModal";


const AdminManageTopics = () => {
    const [topics, setTopics] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, size: 10, totalPages: 1, totalElements: 0 })
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [headers, setHeaders] = useState(["#", "Topic ID", "Topic Name"])

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);



    const fetchData = async (paginationMeta) => {
        try {
            const { meta, items } = await fetchTopics(paginationMeta.page, paginationMeta.size);

            setPaginationMeta(meta);
            setItems(items);

        } catch (error) {
            // setError("Failed to load employee data");
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (newPage) => {
        setPaginationMeta((prev) => ({ ...prev, page: newPage }));
        fetchData({ ...paginationMeta, page: newPage });
    };

    const createNewButton = () => {
        setSelectedTopic(null);
        setModalOpen(true);
    };

    const editButton = async (topicId) => {
        try {
            const topicData = await getTopicByTopicId(topicId);
            setSelectedTopic(topicData);
            setModalOpen(true);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const deleteButton = async (topicId) => {
        try {
            await deleteTopicByTopicId(topicId)
            const { meta, items } = await fetchTopics(paginationMeta.page, paginationMeta.size);

            if (items.length === 0 && paginationMeta.page > 1) {
                handlePageChange(paginationMeta.page - 1);
            } else {
                setPaginationMeta(meta);
                setItems(items);
            }
        } catch (error) {
            console.error("Error: ", error.message)
        }
    }

    const handleSave = async (topic) => {
        try {
            if (selectedTopic) {
                await updateTopic(topic);
            } else {
                await createTopic(topic);
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
        <AdminLayout title="Manage Topics">
            {loading ? (

                <Spinner height="h-[70vh]" />
            ) : (
                <Table
                    title="Topics List"
                    headers={["Topic ID", "Topic Name", "Created By"]}
                    items={items}
                    meta={paginationMeta}
                    keys={["topicId", "topicName", "createdBy"]}
                    handlePageChange={handlePageChange}
                    createNewButton={createNewButton}
                    editButton={editButton}
                    deleteButton={deleteButton}
                />
            )}

            {/* Modal */}
            <TopicModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                topic={selectedTopic}
            />

        </AdminLayout>
    );
};

export default AdminManageTopics;
