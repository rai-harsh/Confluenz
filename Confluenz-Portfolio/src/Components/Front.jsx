import React from "react";
import  "../assets/styles/Front.css"
export default function Front(){
    return(
        <>  
            <div className="bg-black pt-14 py-7 px-8 md:px-20 " >
                <div className="border-gray-700 border rounded-lg flex flex-col lg:flex-row items-center sm:pl-10 justify-between ">
                    <div className=" w-fit flex flex-col gap-6 lg:items-start py-10 items-center ">
                        <h4 className="font-display text-white text-sm tracking-wide">PHOTOGRAPHY SOCIETY</h4>
                        
                        <div className="sign">
                        <h1 className="heading ">CONFLUENZ</h1>
                        </div>
                        <p className="font-display text-white text-sm ">Modern and creative photo sessions in any direction</p>
                        <div className="flex flex-row pt-16">
                            <button className="bg-white py-2 px-4 rounded-sm">More details</button>
                        </div>
                    </div>
                    <div className=" sm:min-w-96">
                        <img src="./src/assets/conf.png" className="ml-auto shadowfilter" alt="Laptop-conf" />
                    </div>
                </div>
            </div>
        </>
    )
}