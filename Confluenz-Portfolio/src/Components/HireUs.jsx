import React from "react";
import image from '../assets/hireUs.jpg';

export default function HireUs() {
    return (
        <>
            <div className="card-wrapper group sm:mx-5 mx-2 sm:p-20 py-32 min-h-40 " style={{ backgroundImage: `url(${image})` }}>
                <div className="card-content lg:w-3/4 md:w-11/12 sm:py-20 py-10 px-8 my-auto">
                    <h1 className=" card-heading heading md:text-9xl sm:text-8xl max-[400px]:text-6xl  hover:tracking-wider">
                        HIRE US !!
                    </h1>
                </div>
            </div>
        </>
    )
}