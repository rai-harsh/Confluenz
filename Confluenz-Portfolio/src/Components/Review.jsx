import React from "react";

export default function Review(props) {
    return (
        <>
            {/* Review container with fixed height and overflow hidden */}
            <div className="review relative p-10 rounded-xl shadow-xl text-center group overflow-hidden h-56">
                <div className="relative h-full">
                    <p className="relative h-full flex items-center justify-center">
                        {/* Quote left icon */}
                        <i className="fa-solid fa-quote-left absolute text-3xl text-gray-400 top-4 left-4 opacity-70 group-hover:top-2 group-hover:left-2 transition-all"></i>
                        {/* Review text */}
                        <span className="block px-4">{props.review}</span>
                        {/* Quote right icon */}
                        <i className="fa-solid fa-quote-right absolute text-3xl text-gray-400 bottom-4 right-4 opacity-70 group-hover:bottom-2 group-hover:right-2 transition-all"></i>
                    </p>
                </div>
            </div>

            {/* Person info */}
            <div className="person flex justify-center mt-8 font-display items-center gap-3">
                {/* Image wrapper with fixed aspect ratio */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                        src={`http://localhost:4000${props.img}`}
                        className="w-full h-full object-cover"
                        alt={props.name}
                    />
                </div>

                {/* Name and occupation */}
                <div className="occupation flex flex-col">
                    <h3 className="font-bold">{props.name}</h3>
                    {/* Optional occupation */}
                    {/* <h4 className="text-gray-700">{props.occupation}</h4> */}
                </div>
            </div>
        </>
    );
}
