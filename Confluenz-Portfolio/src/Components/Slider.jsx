import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Slider() {
    const [categories, setCategories] = useState([]);
    const initialTranslateLTR = -48 * 4;
    const initialTranslateRTL = 36 * 4;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories'); // Replace with your actual backend URL
                setCategories(response.data.map((category) => category.category));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();

        const line4 = document.querySelectorAll('#line4');
        if (line4.length > 0) {
            setupIntersectionObserver(line4, true, 0.8);
        }

        return () => {
            line4.forEach(element => {
                const scrollHandlerBound = element.scrollHandlerBound;
                if (scrollHandlerBound) {
                    document.removeEventListener('scroll', scrollHandlerBound);
                }
            });
        };
    }, []);

    function scrollHandler(element, isLTR, speed) {
        const translateX = (window.innerHeight - element.getBoundingClientRect().top) * speed;

        let totalTranslate = 0;
        if (isLTR) {
            totalTranslate = translateX + initialTranslateLTR;
        } else {
            totalTranslate = -(translateX + initialTranslateRTL);
        }

        element.style.transform = `translateX(${totalTranslate}px)`;
    }

    function setupIntersectionObserver(elements, isLTR, speed) {
        const intersectionCallback = (entries) => {
            const isIntersecting = entries[0].isIntersecting;
            if (isIntersecting) {
                const scrollHandlerBound = () => scrollHandler(entries[0].target, isLTR, speed);
                document.addEventListener('scroll', scrollHandlerBound);
                entries[0].target.scrollHandlerBound = scrollHandlerBound;
            } else {
                const scrollHandlerBound = entries[0].target.scrollHandlerBound;
                if (scrollHandlerBound) {
                    document.removeEventListener('scroll', scrollHandlerBound);
                }
            }
        };

        const intersectionObserver = new IntersectionObserver(intersectionCallback);
        elements.forEach(element => intersectionObserver.observe(element));
    }

    return (
        <div id="features-line" className="container mt-0 lg:mt-4 mx-auto">
            <div className="border border-gray-300 rounded-lg overflow-hidden flex justify-center p-4">
                <div id="line4" className="flex gap-8 p-6 transition duration-500">
                    {categories.map((category, index) => (
                        <React.Fragment key={index}>
                            <h3 className="my-0 mx-2 whitespace-nowrap font-display text-2xl font-semibold leading-7">
                                {category}
                            </h3>
                            {index < categories.length - 1 && <span>•</span>}
                        </React.Fragment>
                    ))}
                    <span>•</span>
                    {categories.map((category, index) => (
                        <React.Fragment key={index}>
                            <h3 className="my-0 mx-2 whitespace-nowrap font-display text-2xl font-semibold leading-7">
                                {category}
                            </h3>
                            {index < categories.length - 1 && <span>•</span>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
