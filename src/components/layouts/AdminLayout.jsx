import React, { useState } from "react";
import AdminSidebar from "../common/AdminSidebar";
import AdminHeaderBar from "../common/AdminHeaderBar";
import Title from "../common/Title";
import Spinner from "../common/Spinner";
import { useUser } from "../../services/UserContext";

const AdminLayout = ({ children, title }) => {
    const { user, profileImageUrl, loadingUser } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex flex-col w-full">
            {!loadingUser && user && user.role === "ADMIN" ? (
                <>
                    <AdminHeaderBar user={user} profileImage={profileImageUrl} onToggleSidebar={toggleSidebar} />
                    <div className="flex">
                        <AdminSidebar isSidebarOpen={isSidebarOpen} />
                        <main className={`p-6 flex-1 overflow-y-auto mt-16 transition-all duration-300  ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                            <Title title={title} />
                            {children}
                        </main>
                    </div>
                </>
            ) : (
                <Spinner />
            )}
        </div>
    );
};

export default AdminLayout;
