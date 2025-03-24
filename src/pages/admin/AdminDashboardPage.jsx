import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import TextEditor from "@/components/common/TextEditor";
import MCQCreator from "@/components/common/MCQCreator";
import CourseCard from "@/components/common/CourseCard";

const AdminDashboardPage = () => {
    const [content, setContent] = useState("");

    return (
        <AdminLayout title="Dashboard">

            <div className="flex justify-center items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 h-screen">
                    <CourseCard
                        title="React for Beginners"
                        description="Learn the basics of React and build your first application."
                        imageUrl="https://picsum.photos/600/360"
                        isNew={true}
                        readTime="3 min read"
                        isInProgress={true}
                        courseType={"Digital Course"}
                    />

                    <CourseCard
                        title="React for Beginners"
                        description="Learn the basics of React and build your first application."
                        imageUrl="https://picsum.photos/600/360"
                        isNew={true}
                        readTime="3 min read"
                        isInProgress={true}
                        courseType={"Digital Course"}
                    />

                    <CourseCard
                        title="React for Beginners"
                        description="Learn the basics of React and build your first application."
                        imageUrl="https://picsum.photos/600/360"
                        isNew={true}
                        readTime="3 min read"
                        isInProgress={true}
                        courseType={"Digital Course"}
                    />

                    <CourseCard
                        title="React for Beginners"
                        description="Learn the basics of React and build your first application."
                        imageUrl="https://picsum.photos/600/360"
                        isNew={true}
                        readTime="3 min read"
                        isInProgress={true}
                        courseType={"Digital Course"}
                    />

                    <CourseCard
                        title="React for Beginners"
                        description="Learn the basics of React and build your first application."
                        imageUrl="https://picsum.photos/600/360"
                        isNew={true}
                        readTime="3 min read"
                        isInProgress={true}
                        courseType={"Digital Course"}
                    />
                </div>
            </div>



        </AdminLayout>
    );
};

export default AdminDashboardPage;
