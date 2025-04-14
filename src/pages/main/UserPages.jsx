import UserLayout from "@/components/layouts/UserLayout";
import { UserProvider } from "@/services/UserContext";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "@/pages/main/UserDashboard";
import LessonContent from "@/pages/course/LessonContent";
import CourseLayout from "@/components/layouts/CourseLayout";
import QuizContent from "@/pages/course/QuizContent";
import RatingAndFeedbackPage from "@/pages/main/RatingAndFeedbackPage";

const UserPages = () => {
    return (
        <UserProvider>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/learn" element={<UserDashboard />} />
                    <Route path="/learn/courses/:courseId" element={<CourseLayout />}>
                        <Route path="lessons/:lessonId" element={<LessonContent />} />
                        <Route path="quizzes/:quizId" element={<QuizContent />} />
                        <Route path="feedback" element={<RatingAndFeedbackPage />} />
                    </Route>
                </Route>
            </Routes>
        </UserProvider>
    );
};

export default UserPages;
