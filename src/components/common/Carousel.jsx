import React, { forwardRef } from "react";
import CarouselTemplate from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Carousel = forwardRef(({ courses, onSlideChange }, ref) => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 4,
            slidesToSlide: 4,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1150 },
            items: 4,
            slidesToSlide: 4,
        },

        tablet: {
            breakpoint: { max: 1150, min: 880 },
            items: 3,
            slidesToSlide: 3,
        },
        tablet2: {
            breakpoint: { max: 880, min: 600 },
            items: 2,
            slidesToSlide: 2,
        },
        mobile: {
            breakpoint: { max: 600, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    return (
        <div>
            <CarouselTemplate
                ref={ref}
                responsive={responsive}
                removeArrowOnDeviceType={["tablet", "mobile"]}
                arrows={false}
            >
                {courses.map((course, index) => (
                    <div key={index} className="p-2">
                        {course}
                    </div>
                ))}
            </CarouselTemplate>
        </div>
    );
});

export default Carousel;