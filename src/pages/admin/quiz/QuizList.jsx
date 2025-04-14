import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import Table from "@/components/common/Table";
import { deleteQuizByQuizId, fetchQuizzesByCourse } from "@/services/QuizService";
import Spinner from "@/components/common/Spinner";
import { getCourseByCourseId } from "@/services/CourseService";


const QuizList = () => {
    const { courseId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const [course, setCourse] = useState();
    const [paginationMeta, setPaginationMeta] = useState({ page: 1, size: 10, totalPages: 1, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(true);


    useEffect(() => {
        fetchData(paginationMeta);
    }, [courseId]);

    const fetchData = async (paginationMeta) => {
        try {
            setLoadingData(true)
            const { meta, items } = await fetchQuizzesByCourse(courseId, paginationMeta.page, paginationMeta.size);
            console.log({ meta, items })

            if (items.length > 0) {
                setPaginationMeta(meta);
                setQuizzes(items);
            }

            const course = await getCourseByCourseId(courseId);
            setCourse(course);

        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoadingData(false)
            setLoading(false);
        }



    };

    const handlePageChange = (newPage) => {
        setPaginationMeta((prev) => ({ ...prev, page: newPage }));
        fetchData({ ...paginationMeta, page: newPage });
    };

    const deleteButton = async (quizId) => {
        try {
            await deleteQuizByQuizId(quizId);
        } catch (error) {
            console.error("Error: ", error.message);
        } finally {
            fetchData(paginationMeta);
        }
    };


    return (
        <AdminLayout title={"Manage Quizzes"}>
            {course && !loading ? (
                <Table
                    title={`Quizzes for Course: ${course.courseName || "Unknown Course"} (ID: ${course.courseId})`}
                    headers={["ID", "Quiz Name", "Description", "Difficulty"]}
                    keys={["quizId", "quizName", "description", "difficulty"]}
                    items={quizzes}
                    meta={paginationMeta}
                    handlePageChange={handlePageChange}
                    createNewButton={() => navigate(`/admin/quizzes/courses/${courseId}/quiz/create`)}
                    editButton={(quizId) => navigate(`/admin/quizzes/courses/${courseId}/quiz/edit/${quizId}`)}
                    deleteButton={deleteButton}
                    loading={loadingData}
                />
            ) : (
                <Spinner height="h-[70vh]" />
            )}
        </AdminLayout>
    );
};

export default QuizList;
