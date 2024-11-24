import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Portfolio() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios
            .get("/api/home")
            .then((response) => {
                setImages(response.data);
                console.log(response.data); // Log response to inspect structure
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Ensure cp has at least 9 items by using placeholders for missing data
    const cp = Array(9).fill().map((_, index) => {
        const item = images[index] || {}; // Default to empty object if missing
        return {
            link: item.image_url ? `http://localhost:4000${item.image_url}` : "/path/to/default.jpg", // Placeholder image if missing
            caption: item.caption || "Default caption" // Placeholder caption if missing
        };
    });

    return (
        <div className="pt-40 py-7 sm:px-8 px-2 md:px-20 flex flex-col items-center bg-gradient-to-b from-black via-gray-400 to-white">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6 w-11/12">
                <div className="h-80 relative group bg-black rounded-lg">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0 group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[1].caption}
                    </h4>
                    <img
                        src={cp[0].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="1"
                    />
                </div>
                <div className="group h-80 relative bg-black rounded-lg">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0 group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[1].caption}
                    </h4>
                    <img
                        src={cp[1].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="2"
                    />
                </div>
                <div className="group sm:row-span-2 h-120 relative bg-black rounded-lg">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0 group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[2].caption}
                    </h4>
                    <img
                        src={cp[2].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="3"
                    />
                </div>
                <div className="group sm:row-span-2 relative bg-black rounded-lg">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0 group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[3].caption}
                    </h4>
                    <img
                        src={cp[3].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="4"
                    />
                </div>
                <div className="group h-80 relative bg-black rounded-lg">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0 group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[4].caption}
                    </h4>
                    <img
                        src={cp[4].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="5"
                    />
                </div>
                <div className="group h-80 relative bg-black rounded-lg">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0 group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[5].caption}
                    </h4>
                    <img
                        src={cp[5].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="6"
                    />
                </div>
                <div className="group h-80 relative bg-black rounded-lg">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0 group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[6].caption}
                    </h4>
                    <img
                        src={cp[6].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="7"
                    />
                </div>
                <div className="group h-80 relative bg-black rounded-lg">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0  group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[7].caption}
                    </h4>
                    <img
                        src={cp[7].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="8"
                    />
                </div>
                <div className="group h-80 relative bg-black rounded-lg sm:col-span-2">
                    <h4 className="text-white font-display text-xl font-semibold tracking-widest inset-0 flex items-center justify-center absolute z-10 opacity-0 group-hover:opacity-100 duration-200 top-1/4 group-hover:top-0">
                        {cp[8].caption}
                    </h4>
                    <img
                        src={cp[8].link}
                        className="object-cover group-hover:scale-105 w-full h-full rounded-lg group-hover:blur-sm duration-200 group-hover:brightness-50"
                        alt="9"
                    />
                </div>
            </div>
        </div>

    );
}
