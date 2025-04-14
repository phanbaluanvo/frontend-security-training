
const ProgressBar = ({ progress }) => {

    return (
        <div className="fixed top-[64px] left-0 w-full h-1 bg-gray-200 z-50">
            <div
                className="h-full bg-red-800 transition-all duration-100"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
