import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminManageTopics from '@/pages/admin/training-modules/AdminManageTopics';
import { UserProvider } from '@/services/UserContext';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminManageModules from '@/pages/admin/training-modules/AdminManageModules';
import AdminManageCourses from '@/pages/admin/training-modules/AdminManageCourses';
import AdminManageLessons from '@/pages/admin/training-modules/AdminManageLessons';


function AdminPages() {

    return (
        <UserProvider>
            <Routes>
                <Route path="/dashboard" element={<AdminDashboardPage />} />
                <Route path="/topics" element={<AdminManageTopics />} />
                <Route path="/modules" element={<AdminManageModules />} />
                <Route path="/courses" element={<AdminManageCourses />} />
                <Route path="/lessons" element={<AdminManageLessons />} />
            </Routes>
        </UserProvider>

    );
}

export default AdminPages;
