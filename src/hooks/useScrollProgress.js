import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useScrollProgress = (isContentReady = true, isComplete = false) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const location = useLocation();

    useEffect(() => {
        // Reset progress and scroll on route change
        setScrollProgress(0);
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        if (!isContentReady) return;

        const calculateProgress = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrollableHeight = scrollHeight - clientHeight;

            if (isComplete || scrollableHeight < 20 || scrollTop + clientHeight >= scrollHeight - 5) {
                setScrollProgress(100);
                return;
            }

            const currentProgress = (scrollTop / scrollableHeight) * 100;

            // Chỉ cập nhật nếu tiến bộ hơn
            setScrollProgress((prev) => currentProgress > prev ? currentProgress : prev);
        };

        calculateProgress(); // Initial run

        window.addEventListener("scroll", calculateProgress);
        window.addEventListener("resize", calculateProgress);

        return () => {
            window.removeEventListener("scroll", calculateProgress);
            window.removeEventListener("resize", calculateProgress);
        };
    }, [isContentReady, isComplete]);

    return scrollProgress;
};

export default useScrollProgress;
