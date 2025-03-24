import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { signout } from '../../services/AuthService';

const AdminHeaderBar = ({ user, profileImage, onToggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleDropdownToggle = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleSignOut = async () => {
        const success = await signout();
        if (success) {
            navigate("/login");
        } else {
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white py-4 px-6 flex justify-between items-center border-b shadow-md z-50 h-16">

            <div className="flex items-center justify-start">
                {/* Toggle Sidebar */}
                <button onClick={onToggleSidebar} className="text-gray-600 text-xl cursor-pointer">
                    <FontAwesomeIcon icon={faBars} />
                </button>

                {/* Logo/Title Section */}
                <span className="text-2xl font-bold text-red-900 ms-3">
                    AgentPhisher
                </span>
            </div>

            <div className="flex items-center space-x-4">
                {/* Notification Button */}
                <button
                    type="button"
                    className="relative py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                    <span>Notification</span>
                    <span className="absolute top-0 right-0 -mt-2 -mr-2 flex">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex text-xs bg-red-500 text-white rounded-full py-0.5 px-1.5">5</span>
                    </span>
                </button>

                {/* User Profile */}
                <img
                    src={profileImage}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                />

                {/* User Dropdown */}
                <div className="relative">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={handleDropdownToggle}>
                        <span className="text-gray-800">{user?.fullName}</span>
                        <FontAwesomeIcon icon={faChevronDown} className="text-gray-600" />
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-0 z-10 mt-7 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow">
                            <div className="px-4 py-3 text-sm text-gray-900">
                                <div>Signed in as</div>
                                <div className="font-medium truncate">{user?.email}</div>
                            </div>
                            <div className="py-2">
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeaderBar;
