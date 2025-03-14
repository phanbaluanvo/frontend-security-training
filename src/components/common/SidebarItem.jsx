import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const SidebarItem = ({ icon, label, isOpen, toggleMenu, children }) => {
    return (
        <li>
            <div
                className={`flex items-center justify-between py-4 px-2 cursor-pointer border-t border-neutral-500 
                    ${isOpen ? "bg-neutral-800" : "hover:bg-neutral-800"}`}
                onClick={toggleMenu}
            >
                <div className="flex items-center">
                    <FontAwesomeIcon icon={icon} className="mr-3 ms-3" />
                    <span>{label}</span>
                </div>
                <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
            </div>
            <ul className={`ml-11 overflow-hidden transition-all duration-300 ease-in-out   ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                {children}
            </ul>
        </li>
    );
};

export default SidebarItem;
