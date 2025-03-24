import UserLayout from "@/components/layouts/UserLayout";
import { UserProvider } from "@/services/UserContext";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "@/pages/main/UserDashboard";
import LessonContent from "@/pages/course/LessonContent";
import CourseLayout from "@/components/layouts/CourseLayout";

const UserPages = () => {
    return (
        <UserProvider>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/learn" element={<UserDashboard />} />
                    <Route path="/learn/courses/:courseId" element={<CourseLayout />}>
                        <Route path="lessons/:lessonId" element={<LessonContent />} />
                    </Route>
                </Route>
            </Routes>
        </UserProvider>
    );
};

export default UserPages;
