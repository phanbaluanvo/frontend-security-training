import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminManageTopics from '@/pages/admin/training-modules/AdminManageTopics';
import { UserProvider } from '@/services/UserContext';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminManageModules from '@/pages/admin/training-modules/AdminManageModules';
import AdminManageCourses from '@/pages/admin/training-modules/AdminManageCourses';
import AdminManageLessons from '@/pages/admin/training-modules/AdminManageLessons';
import LessonPage from '@/pages/admin/training-modules/LessonPage';
import AdminManageQuizzes from '@/pages/admin/quiz/AdminManageQuizzes';
import QuizList from '@/pages/admin/quiz/QuizList'
import QuizzHandlingPage from '@/pages/admin/quiz/QuizzHandlingPage';

function AdminPages() {

    return (
        <UserProvider>
            <Routes>
                <Route path="/dashboard" element={<AdminDashboardPage />} />
                <Route path="/topics" element={<AdminManageTopics />} />
                <Route path="/modules" element={<AdminManageModules />} />
                <Route path="/courses" element={<AdminManageCourses />} />
                <Route path="/lessons" element={<AdminManageLessons />} />
                <Route path="/lessons/create" element={<LessonPage />} />
                <Route path="/lessons/edit/:id" element={<LessonPage />} />
                <Route path="/quizzes" element={<AdminManageQuizzes />} />
                <Route path="/quizzes/courses/:courseId" element={<QuizList />} />
                <Route path="/quizzes/courses/:courseId/quiz/create" element={<QuizzHandlingPage />} />
                <Route path="/quizzes/courses/:courseId/quiz/edit/:quizId" element={<QuizzHandlingPage />} />
            </Routes>
        </UserProvider>

    );
}

export default AdminPages;
