import React, { useEffect, useRef, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import CourseCard from "@/components/common/CourseCard";
import CustomButtonGroup from "@/components/common/CustomButtonGroup";
import Carousel from "@/components/common/Carousel";
import { fetchListCourseCompletedByUser, fetchListCourseRegisteredByUser, fetchListCourses, fetchListCoursesRecommendedForUser } from "@/services/CourseService";
import { registerCourse } from "@/services/LearnService";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/common/Spinner";

const UserDashboard = () => {
    const carouselRef = useRef(null);
    const [recommendCourses, setRecommendCourses] = useState([]);
    const [registeredCourses, setRegisteredCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendCourses();
        fetchRegisteredCourses();
        fetchCompletedCourses();
    }, []);

    const fetchRecommendCourses = async () => {
        setLoading(true);
        const courses = await fetchListCoursesRecommendedForUser();
        setRecommendCourses(courses);
        setLoading(false);
    };

    const fetchRegisteredCourses = async () => {
        setLoading(true);
        const courses = await fetchListCourseRegisteredByUser();
        setRegisteredCourses(courses);
        setLoading(false);
    }

    const fetchCompletedCourses = async () => {
        setLoading(true);
        const courses = await fetchListCourseCompletedByUser();
        setCompletedCourses(courses);
        setLoading(false);
    }

    const handleRegisterCourse = async (courseId) => {
        try {
            setLoading(true)
            const response = await registerCourse(courseId);
            if (response.statusCode === 200) {
                navigate(`/learn/courses/${courseId}`)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    // Number of skeletons to show while loading
    const skeletons = Array.from({ length: 4 });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <main className="min-h-screen">
                {registeredCourses.length > 0 && (
                    <div className="w-full bg-gray-500 py-10">

                        <div className="w-full max-w-6xl mx-auto p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-white">Continue your course</h2>
                                <CustomButtonGroup
                                    onPrevious={() => carouselRef.current?.previous()}
                                    onNext={() => carouselRef.current?.next()}
                                    className="text-white hover:text-gray-200"
                                />
                            </div>

                            <Carousel
                                ref={carouselRef}
                                courses={
                                    loading
                                        ? skeletons.map((_, index) => (
                                            <CourseCard key={index} isLoading={true} />
                                        ))
                                        : registeredCourses.map((course, index) => (
                                            <CourseCard
                                                key={index}
                                                title={course.courseName}
                                                description={course.description}
                                                imageUrl={"https://agent-phisher-bucket.s3.ca-central-1.amazonaws.com/images/card-img.jpeg"}
                                                learningTime={"30m"}
                                                isInProgress={true}
                                                courseType={"Digital Course"}
                                                handleButtonClick={() => navigate(`/learn/courses/${course.courseId}`)}
                                                isLoading={false}
                                                link={`/learn/courses/${course.courseId}`}
                                                btnText="Continue"
                                            />
                                        ))
                                }
                            />
                        </div>
                    </div>
                )}

                {recommendCourses.length > 0 && (
                    <div className="w-full max-w-6xl mx-auto p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold">Recommend for you</h2>
                            <CustomButtonGroup
                                onPrevious={() => carouselRef.current?.previous()}
                                onNext={() => carouselRef.current?.next()}
                            />
                        </div>

                        <Carousel
                            ref={carouselRef}
                            courses={
                                loading
                                    ? skeletons.map((_, index) => (
                                        <CourseCard key={index} isLoading={true} />
                                    ))
                                    : recommendCourses.map((course, index) => (
                                        <CourseCard
                                            key={index}
                                            title={course.courseName}
                                            description={course.description}
                                            imageUrl={"https://agent-phisher-bucket.s3.ca-central-1.amazonaws.com/images/card-img.jpeg"}
                                            learningTime={"30m"}
                                            isInProgress={false}
                                            courseType={"Digital Course"}
                                            handleButtonClick={() => handleRegisterCourse(course.courseId)}
                                            isLoading={false}
                                            link={`/learn/courses/${course.courseId}`}
                                        />
                                    ))
                            }
                        />
                    </div>
                )}

                {completedCourses.length > 0 && (
                    <div className="w-full py-10">

                        <div className="w-full max-w-6xl mx-auto p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold">Completed courses</h2>
                                <CustomButtonGroup
                                    onPrevious={() => carouselRef.current?.previous()}
                                    onNext={() => carouselRef.current?.next()}
                                    className="text-white hover:text-gray-200"
                                />
                            </div>

                            <Carousel
                                ref={carouselRef}
                                courses={
                                    loading
                                        ? skeletons.map((_, index) => (
                                            <CourseCard key={index} isLoading={true} />
                                        ))
                                        : completedCourses.map((course, index) => (
                                            <CourseCard
                                                key={index}
                                                title={course.courseName}
                                                description={course.description}
                                                imageUrl={"https://agent-phisher-bucket.s3.ca-central-1.amazonaws.com/images/card-img.jpeg"}
                                                isCompleted={true}
                                                learningTime={"30m"}
                                                isInProgress={false}
                                                courseType={"Digital Course"}
                                                handleButtonClick={() => navigate(`/learn/courses/${course.courseId}`)}
                                                isLoading={false}
                                                link={`/learn/courses/${course.courseId}`}
                                                btnText="Retake"
                                            />
                                        ))
                                }
                            />
                        </div>
                    </div>
                )}
            </main>
            <footer className="footer sm:footer-horizontal footer-center text-base-content bg-red-800">
                <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10 sm:py-10 lg:px-8">
                    <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                        <div className="pb-6">
                            <a href="#" className="text-sm leading-6 text-white hover:text-gray-400">
                                Lessons
                            </a>
                        </div>
                        <div className="pb-6">
                            <a href="#" className="text-sm leading-6 text-white hover:text-gray-400">
                                Glossary
                            </a>
                        </div>
                        <div className="pb-6">
                            <a href="#" className="text-sm leading-6 text-white hover:text-gray-400">
                                Terms and Conditions
                            </a>
                        </div>
                        <div className="pb-6">
                            <a href="#" className="text-sm leading-6 text-white hover:text-gray-400">
                                Privacy Policy
                            </a>
                        </div>
                    </nav>
                    <p className="mt-10 text-center text-xs leading-5 text-white">
                        © 2025 AgentPhisher All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default UserDashboard;
