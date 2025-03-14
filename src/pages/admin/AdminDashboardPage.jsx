import React, { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import TextEditor from "@/components/common/TextEditor";

const AdminDashboardPage = () => {
    const [content, setContent] = useState("");

    return (
        <AdminLayout title="Dashboard">
        </AdminLayout>
    );
};

export default AdminDashboardPage;
