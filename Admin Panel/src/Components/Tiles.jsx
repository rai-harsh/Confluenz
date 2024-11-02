import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from "react-router-dom"; //use location is being used to get categories
import ImageForm from './ImageForm';

const Tiles = () => {
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newImage, setNewImage] = useState(null);

    const { categoryType } = useParams();
    console.log(useLocation().pathname.split("/")[1])
    //Fetch images from that particular category
    useEffect(() => {
        axios
            .get(`/api/admin/categories/${categoryType}`)

            .then((response) => setImages(response.data))
            .catch((error) => console.error(error));
    }, []);

    // Delete the image
    const handleDelete = async (imageId) => {
        try {
            await axios.delete(`/api/admin/categories/${imageId}`);
            setImages(images.filter((img) => img.id !== imageId));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };
    //console.log(images);
    const handleFileChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    // Add an images
    const handleAddImage = async () => {
        if (!newImage) return;

        const formData = new FormData();
        formData.append('image', newImage);

        try {
            await axios.post(`/api/admin/categories/upload/${categoryType}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Uploaded")
            // Refresh images after adding a new one
            const response = await axios.get(`/api/admin/categories/${categoryType}`);
            setImages(response.data);
            setNewImage(null);
            setShowModal(false);
            console.log("updated")
            
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };
    // console.log(images);
    return (
        <div className="p-4 flex flex-col">
            <h1 className='text-3xl mx-auto mt-10 md:mb-20 mb-10 font-display font-bold border-b-2 sm:text-6xl '> {categoryType||"loading"} </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-5/6 m-auto">
                {images.map((image) => (
                    <div key={image.id} className="relative group h-52  hover:brightness-100 overflow-hidden rounded-lg shadow-lg">
                        <img
                            src={`http://localhost:4000${image.image_url}`}
                            alt="Category"
                            className="w-full h-full object-cover rounded-md shadow-sm brightness-75"
                        />
                        <button 
                            onClick={() => handleDelete(image.id)}
                            className="rounded-md absolute top-2 right-2 bg-red-600 px-1 hover:-translate-x-1 transition "
                        >
                            <h4 className='font-semibold  text-white'>Delete</h4>
                        </button>
                        
                    </div>
                ))}
                <div
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center w-full h-24 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition"
                >
                    <span className="text-gray-500 text-sm">+ Add New Image</span>
                </div>
            </div>

            {/* Modal for Image Upload */}
            {showModal && (
                <ImageForm
                onClose={() => setShowModal(false)}
                handleFileChange={handleFileChange}
                handleAddImage={handleAddImage}
            />
            )}
        </div>
    );
};

export default Tiles;
