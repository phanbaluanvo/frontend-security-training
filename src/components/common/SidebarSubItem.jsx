import { NavLink } from "react-router-dom";

const SidebarSubItem = ({ to, label }) => {
    return (
        <li>
            <NavLink
                to={to}
                className={({ isActive }) => `block p-2  rounded-l-sm ${isActive ? "bg-neutral-500 text-white " : "hover:bg-neutral-800"}`}
            >
                {label}
            </NavLink>
        </li>
    );
};

export default SidebarSubItem;
