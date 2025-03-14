import React from 'react';

const Pagination = ({ meta, onPageChange }) => {

    const { page, totalPages, size, totalElements } = meta;

    const indexOfLastRow = page * size;
    const indexOfFirstRow = indexOfLastRow - size;

    // Generate the page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 10) {
            // If total pages are less than or equal to 10, show all page numbers
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // If total pages are more than 10, show ellipsis where necessary
            if (page <= 4) {
                pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (page > 4 && page < totalPages - 3) {
                pageNumbers.push(1, '...', page - 1, page, page + 1, '...', totalPages);
            } else {
                pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
        }
        return pageNumbers;
    };

    return (
        <div className="flex justify-between items-center mt-4">
            {/* Showing results text */}
            <div className="text-sm text-gray-600 py-3 px-4">
                Showing <strong>{totalElements === 0 ? 0 : indexOfFirstRow + 1}</strong> to <strong>{Math.min(indexOfLastRow, totalElements)}</strong> of <strong>{totalElements}</strong> results
            </div>

            {/* Pagination buttons */}
            <nav>
                <ul className="flex items-center py-3 px-4">
                    {/* Previous button */}
                    <li>
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 
                            disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </button>
                    </li>

                    {/* Page number buttons */}
                    {getPageNumbers().map((pageBtn, index) => (
                        <li key={index}>
                            {typeof pageBtn === 'number' ? (
                                <button
                                    onClick={() => onPageChange(pageBtn)}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${pageBtn === page
                                        ? 'z-10 text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                                        }`}
                                >
                                    {pageBtn}
                                </button>
                            ) : (
                                <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">
                                    {pageBtn}
                                </span>
                            )}
                        </li>
                    ))}

                    {/* Next button */}
                    <li>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 
                            disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;
