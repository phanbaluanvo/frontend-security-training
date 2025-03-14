import React, { useState, useEffect } from "react";

const TopicModal = ({ isOpen, onClose, onSave, topic }) => {
    const [topicName, setTopicName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (topic) {
            setTopicName(topic.topicName);
        } else {
            setTopicName("");
        }

        setErrorMessage(null)
    }, [topic, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleSave = async () => {

        if (topicName.trim() === "") {
            setErrorMessage("Topic name can not be empty!");
            return;
        }

        try {
            await onSave({ ...topic, topicName });
        } catch (error) {
            setErrorMessage(error.message || "Failed to save topic")
        }

    };

    return isOpen ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black-200 bg-opacity-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

            {/* Modal */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-4xl z-10 relative">
                <h2 className="text-xl font-semibold mb-4">
                    {topic ? "Edit Topic" : "Create Topic"}
                </h2>

                {/* Grid Layout */}
                <div className={`grid ${topic ? "grid-cols-12 gap-4" : "grid-cols-1"} space-y-2`}>
                    {/* ID (for update only) */}
                    {topic && topic.topicId && (
                        <div className="col-span-2">
                            <label className="text-gray-600 text-sm font-medium">Topic ID:</label>
                            <input
                                type="text"
                                value={topic.topicId}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                readOnly
                            />
                        </div>
                    )}

                    {/* Input Topic Name */}
                    <div className={`${topic ? "col-span-10" : "col-span-1"}`}>
                        <label className="text-gray-600 text-sm font-medium">Topic Name:</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter topic name"
                            value={topicName}
                            onChange={(e) => setTopicName(e.target.value)}
                        />
                        {errorMessage && (
                            <p className="text-red-500 text-sm italic mt-1">{errorMessage}</p>
                        )}
                    </div>

                    {topic && (
                        <>
                            <div className="col-span-3">
                                <label className="text-gray-600 text-sm font-medium">Created At:</label>
                                <input
                                    type="text"
                                    value={topic.createdAt}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="text-gray-600 text-sm font-medium">Created By:</label>
                                <input
                                    type="text"
                                    value={topic.createdBy}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                    readOnly
                                />
                            </div>

                            {/* Updated At & Updated By */}
                            <div className="col-span-3">
                                <label className="text-gray-600 text-sm font-medium">Updated At:</label>
                                <input
                                    type="text"
                                    value={topic.updatedAt}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                            <div className="col-span-3">
                                <label className="text-gray-600 text-sm font-medium">Updated By:</label>
                                <input
                                    type="text"
                                    value={topic.updatedBy}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
                    >
                        {topic ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default TopicModal;
