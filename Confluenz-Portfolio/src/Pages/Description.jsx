import React, { useEffect, useState } from "react";
import Gallery from "../Components/Gallery.jsx";
import { useParams,useLocation } from "react-router-dom";
import axios from "axios";


// Parallax Cover with Smooth Scroll Effect
const ParallaxCover = ({ imageSrc }) => {
  const [offsetY, setOffsetY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    setTimeout(() => {
      setIsVisible(true); // Trigger slide-in animation
    }, 500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
console.log( `url(${imageSrc})`);
  return (
    <div
      className="h-48 xs:h-56 sm:h-72 md:h-96 relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundPositionY: `${-offsetY * 0.4}px`, // Smooth linear parallax effect
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <h1
          className={`text-3xl tracking-[0.5em] sm:text-5xl md:text-7xl text-white font-bold transition-transform duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {useLocation().pathname.split("/")[1] || "loading"}
        </h1>
      </div>
    </div>
  );
};

export default function Walk() {
  const [items, setItems] = useState([]);
  const [images, setImages] = useState([]);

  const loc = useLocation();
  const pathParts = loc.pathname.split("/");
  const type = pathParts[1];
  const { walkId, eventId } = useParams();
  const id = type === "Photowalks" ? walkId : eventId;

  const fetchDetails = ()=>{
    axios
        .get(`/api/${type}/${id}`)
        .then((response) => setItems(response.data))
        .catch((error) => console.error("Error fetching data:", error));
  }
  const fetchImages = ()=>{
    axios
    .get(`/api/images/${type}/${id}`)
    .then((response) => setImages(response.data))
    .catch((error) => console.error("Error fetching data:", error));
  }
  useEffect(() => {
    if (id) {
      fetchDetails();
      fetchImages();
    }
  }, [id]);
 //console.log(images)
  
 const coverImage = items.length > 0 ? `http://localhost:4000${items[0].cover_img}` : "";
 const location = items[0]?.locations || items[0]?.venue || "Loading...";
  const date = items[0]?.date?.slice(0, 10) || "Loading...";
  const description = items[0]?.description || "Loading...";
  const eventName = type === "Events" ? items[0]?.name : "";

  const [isLocationVisible, setLocationVisible] = useState(false);
   //console.log(coverImage); 
  useEffect(() => {
    setTimeout(() => setLocationVisible(true), 700);
  }, []);

  // const images = items.map((item) => `http://localhost:4000${item.image_url}`);
  // console.log(images);
  return (
    <>
      <div className="flex flex-col min-h-screen pt-10">
        <ParallaxCover imageSrc={coverImage} />

        {eventName && (
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-6 mb-4 text-gray-900 tracking-wide 
            transition-all duration-700 ease-out transform ${
              isLocationVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              animation: "fadeSlideUp 1s ease-out forwards",
            }}
          >
            {eventName}
          </h1>
        )}

        <div className="flex flex-col items-center px-4 py-8 sm:py-12 max-w-screen-lg mx-auto">
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-2 text-center transition-transform duration-700 ease-out ${
              isLocationVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            {location}
          </h2>

          <p
            className={`text-md sm:text-lg text-gray-500 mb-4 text-center transition-transform duration-700 ease-out ${
              isLocationVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            {date}
          </p>

          <div className="w-full mx-auto border-t-2 border-b-2 pb-6 border-gray-300 pt-6">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 text-center leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
      <Gallery images={images} />
    </>
  );
}
  