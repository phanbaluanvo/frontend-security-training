import React, { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import Input from "@/components/common/Input";


const TopicModal = ({ isOpen, onClose, onSave, topic }) => {
    const [topicName, setTopicName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoadingModal(true);
            if (topic) {
                setTopicName(topic.topicName || "");
            } else {
                setTopicName("");
            }
            setErrorMessage("");
            setLoadingModal(false);
        }
    }, [topic, isOpen]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (topicName.trim() === "") {
            setErrorMessage("Topic name can not be empty!");
            return;
        }

        try {
            setActionLoading(true);
            await onSave({ ...topic, topicName });
            document.getElementById('topic_modal').close();
            onClose();
        } catch (error) {
            setErrorMessage(error.message || "Failed to save topic");
        } finally {
            setActionLoading(false);
        }
    };

    // Nếu modal đang mở, hiển thị nó
    if (isOpen) {
        document.getElementById('topic_modal').showModal();
    }

    return (
        <dialog id="topic_modal" className="modal">
            <div className="modal-box max-w-[65vw] overflow-y-visible">
                {loadingModal ? (
                    <div className="flex justify-center items-center py-10">
                        <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4">
                            {topic ? "Edit Topic" : "Create Topic"}
                        </h2>

                        <form onSubmit={handleSave}>
                            <div className={`grid ${topic ? "grid-cols-12 gap-4" : "grid-cols-1"} space-y-2`}>
                                {/* ID (for update only) */}
                                {topic && topic.topicId && (
                                    <div className="col-span-2">

                                        <Input
                                            name="topicId"
                                            label="Topic ID:"
                                            value={topic.topicId}
                                            className="bg-gray-200"
                                            readOnly
                                        />
                                    </div>
                                )}

                                {/* Input Topic Name */}
                                <div className={`${topic ? "col-span-10" : "col-span-1"}`}>
                                    <Input
                                        name="topicName"
                                        label="Topic Name:"
                                        value={topicName}
                                        onChange={(e) => setTopicName(e.target.value)}
                                        placeholder="Enter topic name"
                                    />
                                </div>


                                {errorMessage && (
                                    <p className="text-red-500 text-sm italic mt-1 col-span-12">{errorMessage}</p>
                                )}
                            </div>

                            <div className="modal-action mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById('topic_modal').close();
                                        onClose();
                                    }}
                                    className="btn btn-ghost min-w-[100px]"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <LoaderCircle className="animate-spin w-5 h-5" /> :
                                        topic ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default TopicModal;
