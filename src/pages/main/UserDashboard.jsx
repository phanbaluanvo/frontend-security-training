import React, { useEffect, useRef, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import CourseCard from "@/components/common/CourseCard";
import CustomButtonGroup from "@/components/common/CustomButtonGroup";
import Carousel from "@/components/common/Carousel";
import { fetchListCourses } from "@/services/CourseService";
import { registerCourse } from "@/services/LearnService";
const UserDashboard = () => {
    const carouselRef = useRef(null); // Ref để điều khiển Carousel
    const [recommendCourses, setRecommendCourses] = useState([]);


    useEffect(() => {
        fetchRecommendCourses();
    }, []);

    const fetchRecommendCourses = async () => {
        const courses = await fetchListCourses();
        setRecommendCourses(courses);
    }

    const handleRegisterCourse = async (courseId) => {
        await registerCourse(courseId);
    }

    return (
        <main>
            <div className="w-full bg-blue-100 py-10">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Full Width Component</h2>
                    <p>This component spans the full width of the screen.</p>
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto p-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold">Recommend for you</h2>
                    <CustomButtonGroup
                        onPrevious={() => carouselRef.current.previous()}
                        onNext={() => carouselRef.current.next()}
                    />
                </div>
                <Carousel
                    ref={carouselRef}
                    courses={recommendCourses.map((course, index) => (
                        <CourseCard key={index}
                            title={course.courseName}
                            description={course.description}
                            imageUrl={"https://picsum.photos/600/360"}
                            isNew={false}
                            learningTime={"1h 30m"}
                            isInProgress={false}
                            courseType={"Digital Course"}
                            handleButtonClick={() => handleRegisterCourse(course.courseId)}
                        />
                    ))}
                />
            </div>

            <div className="w-full bg-green-100 py-10">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Another Full Width Component</h2>
                    <p>This component also spans the full width of the screen.</p>
                </div>
            </div>
        </main>
    );
};

export default UserDashboard;