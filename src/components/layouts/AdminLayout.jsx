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
        <div className="flex flex-col">
            {!loadingUser && user && user.role === "ADMIN" ? (
                <>
                    <AdminHeaderBar user={user} profileImage={profileImageUrl} onToggleSidebar={toggleSidebar} />
                    <div className="flex">
                        <div className="mt-16">
                            <AdminSidebar isSidebarOpen={isSidebarOpen} />
                        </div>
                        <main className={`w-full p-6 mt-16 transition-all duration-300  ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
