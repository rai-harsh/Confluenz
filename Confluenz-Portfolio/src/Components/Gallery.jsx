import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Gallery({ images }) {
  const { categoryType } = useParams();
  const [fetchedImages, setFetchedImages] = useState(null);

  useEffect(() => {
    // Only fetch images if no `images` prop is provided and `categoryType` is defined
    if (!images && categoryType) {
      const fetchImages = async () => {
        try {
          const response = await axios.get(`/api/category/item/${categoryType}`);
          setFetchedImages(response.data);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };
      fetchImages();
    }
  }, [categoryType, images]);

  // Determine which images to display (prop or fetched)
  const imagesToDisplay = images || fetchedImages;

  return (
    <div className="mx-auto p-2 sm:p-5 md:p-10 lg:p-20 bg-gray-100">
      {/* Conditionally render based on available images */}
      {imagesToDisplay && imagesToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {imagesToDisplay.map((image, index) => (
            <div key={index} className="h-48 xs:h-56 sm:h-60 md:h-80 brightness-100 hover:brightness-100 relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={`http://localhost:4000${image.image_url}`}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-10">
          <p>No images available at the moment.</p>
        </div>
      )}
    </div>
  );
}
