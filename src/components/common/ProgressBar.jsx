import React, { useEffect, useState } from "react";

const ProgressBar = () => {
    const [scrollProgress, setScrollProgress] = useState(0); // Lưu tiến trình hiện tại

    useEffect(() => {
        const updateScrollProgress = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrollableHeight = scrollHeight - clientHeight;

            if (scrollableHeight > 0) {
                const progress = (scrollTop / scrollableHeight) * 100;

                // Lưu giá trị progress lớn nhất
                setScrollProgress((prevProgress) => (progress > prevProgress ? progress : prevProgress));
            } else {
                setScrollProgress(0);
            }
        };

        updateScrollProgress(); // Kiểm tra ngay khi component mount
        window.addEventListener("scroll", updateScrollProgress);
        return () => window.removeEventListener("scroll", updateScrollProgress);
    }, []);

    return (
        <div className="fixed top-[64px] left-0 w-full h-1 bg-gray-200">
            <div
                className="h-full bg-red-600 transition-all duration-100"
                style={{ width: `${scrollProgress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
