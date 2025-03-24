import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDisplay, faUsers, faBookOpen, faFileCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SidebarSubItem from "./SidebarSubItem";
import { MENU_PATHS } from "@/configs/config";

const AdminSidebar = ({ isSidebarOpen }) => {
    const location = useLocation();

    const getDefaultMenu = () => {
        const defaultMenus = new Set();

        Object.entries(MENU_PATHS).forEach(([menu, paths]) => {
            if (paths.some(path => location.pathname.startsWith(path))) {
                defaultMenus.add(menu);
            }
        });

        return defaultMenus;
    };

    const [openMenus, setOpenMenus] = useState(getDefaultMenu);

    const toggleMenu = (menuName) => {
        setOpenMenus((prevMenus) => {
            const newMenus = new Set(prevMenus);
            if (newMenus.has(menuName)) {
                newMenus.delete(menuName);
            } else {
                newMenus.add(menuName);
            }
            return newMenus;
        });
    };

    const isActiveParent = (paths) => paths.some((path) => location.pathname.startsWith(path));

    return (
        <aside className={`bg-red-800 text-white h-screen w-64 fixed left-0 overflow-y-auto border-r border-neutral-700 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"}`}>
            <ul>
                {/* Dashboard */}
                <li>
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center py-4 px-2 border-t border-neutral-500 ${isActive ? "bg-neutral-800" : "hover:bg-neutral-800"}`
                        }
                    >
                        <FontAwesomeIcon icon={faDisplay} className="mr-3 ms-3" />
                        <span>Dashboard</span>
                    </NavLink>
                </li>

                {/* Users Management */}
                <SidebarItem
                    icon={faUsers}
                    label="Users Management"
                    isOpen={openMenus.has("userManagement")}
                    toggleMenu={() => toggleMenu("userManagement")}
                    isActive={isActiveParent(["/admin/users", "/admin/roles"])}
                >
                    <SidebarSubItem to="/admin/users" label="All Users" />
                    <SidebarSubItem to="/admin/roles" label="User Roles" />
                </SidebarItem>

                {/* Training Modules */}
                <SidebarItem
                    icon={faBookOpen}
                    label="Training Modules"
                    isOpen={openMenus.has("trainingModules")}
                    toggleMenu={() => toggleMenu("trainingModules")}
                    isActive={isActiveParent(["/admin/topics", "/admin/modules"])}
                >
                    <SidebarSubItem to="/admin/topics" label="Manage Topics" />
                    <SidebarSubItem to="/admin/courses" label="Manage Courses" />
                    <SidebarSubItem to="/admin/modules" label="Manage Modules" />
                    <SidebarSubItem to="/admin/lessons" label="Manage Lessons" />
                </SidebarItem>

                {/* Quizzes & Exams */}
                <SidebarItem
                    icon={faFileCircleQuestion}
                    label="Quizzes & Exams"
                    isOpen={openMenus.has("quizzes")}
                    toggleMenu={() => toggleMenu("quizzes")}
                    isActive={isActiveParent(["/admin/quizzes", "/admin/exams"])}
                >
                    <SidebarSubItem to="/admin/quizzes" label="Manage Quizzes" />
                    <SidebarSubItem to="/admin/exams" label="Manage Exams" />
                </SidebarItem>
            </ul>
        </aside>
    );
};

export default AdminSidebar;
