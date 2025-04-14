import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';

// Utility function to get nested property value
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Function to render badge based on value with DaisyUI's badge-outline
const renderBadge = (value, type) => {
    let badgeClass = 'badge badge-outline ';
    switch (type) {
        case 'difficulty':
            if (value === 'EASY') {
                badgeClass += 'text-green-500 border-green-500';
            } else if (value === 'MEDIUM') {
                badgeClass += 'text-yellow-500 border-yellow-500';
            } else if (value === 'HARD') {
                badgeClass += 'text-red-500 border-red-500';
            }
            break;
        case 'status':
            if (value === 'Active') {
                badgeClass += 'text-blue-700 border-blue-700';
            } else if (value === 'Inactive') {
                badgeClass += 'text-gray-700 border-gray-700';
            }
            break;
        default:
            break;
    }

    return <span className={badgeClass}>{value}</span>;
};

const Table = ({
    title,
    headers,
    items,
    meta,
    keys,
    handlePageChange,
    createNewButton,
    editButton,
    deleteButton,
    loading,  // Thêm prop loading
}) => {
    return (
        <div className="flex flex-col h-[78vh] bg-white shadow-md rounded-lg mt-4 p-4">
            {/* Title & Create Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                    type="button"
                    className="btn min-w-[100px] text-white bg-red-700 hover:bg-red-800 border-none"
                    onClick={createNewButton}
                >
                    + Create New
                </button>
            </div>

            {/* Table Container */}
            <div className="overflow-y-auto flex-grow relative">
                {loading ? ( // Hiển thị Spinner khi đang tải
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                        <Spinner />
                    </div>
                ) : (
                    <table className="w-full text-left text-gray-700">
                        <thead>
                            <tr className="bg-gray-100 sticky top-0">
                                <th className="py-3 px-4 font-semibold text-gray-900 text-center">#</th>
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className={`py-3 px-4 font-semibold text-sm text-gray-900
                                            ${keys[index].toLowerCase().includes("id") || keys[index].toLowerCase().includes('difficulty') || keys[index].toLowerCase().includes('status') ? "text-center" : "text-left"}
                                        `}
                                    >
                                        {header}
                                    </th>
                                ))}
                                <th className="py-3 px-4 font-semibold text-sm text-gray-900 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="py-4 px-4 text-center">{(meta.page - 1) * meta.size + index + 1}</td>
                                        {keys.map((key, colIndex) => {
                                            const value = getNestedValue(item, key);
                                            const isCenterAligned = key.toLowerCase().includes('id') || key.toLowerCase().includes('difficulty') || key.toLowerCase().includes('status');
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className={`py-4 px-4 overflow-hidden text-ellipsis
                                                        ${isCenterAligned ? 'text-center' : 'text-left'}
                                                    `}
                                                >
                                                    {isCenterAligned ? renderBadge(value, key.toLowerCase()) : <div className="line-clamp-1">{value}</div>}
                                                </td>
                                            );
                                        })}
                                        <td className="py-4 px-4 text-center flex justify-center gap-4">
                                            <button
                                                type="button"
                                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                                                onClick={() => editButton(item[keys[0]])}
                                            >
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </button>
                                            <button
                                                type="button"
                                                className="cursor-pointer text-red-500 hover:text-red-700"
                                                onClick={() => deleteButton(item[keys[0]])}
                                            >
                                                <FontAwesomeIcon icon={faEraser} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length + 2} className="py-3 px-4 text-center text-gray-500">
                                        No data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex-shrink-0">
                <Pagination meta={meta} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default Table;
