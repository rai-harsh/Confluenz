import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import Event from "./Event.jsx";
import Photowalk from "./Photowalk.jsx";

function Items({ type }) {
    const [items, setItems] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const fetchItems = () => {
        if (type) {
            axios
                .get(`/api/admin/${type}`)
                .then((response) => {
                    setItems(response.data);
                    setLoading(false);
                })
                .catch((error) => console.error(error));
        }
    };
    
    useEffect(() => {
        fetchItems();
    }, [type]);
    
    const handleAddCategory = () => {
        setIsAdding(true);
    };
    const itemUploaded = () => {
        setIsAdding(false);
        fetchItems();
    }

    const handleSaveNewCategory = () => {
        const formData = new FormData();
        formData.append("name", newCategoryName);
        
        if (newCategoryImage) {
            formData.append("file", newCategoryImage);
        }

        axios
            .post(`/api/admin/add${type}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setItems([...items, response.data]);
                setNewCategoryName("");
                setNewCategoryImage(null);
                setIsAdding(false);
            })
            .catch((error) => console.error(error));
    };

    const handleDeleteCategory = (id) => {
        axios
            .delete(`/api/categories/${id}`)
            .then(() => {
                setItems(items.filter((category) => category.id !== id));
            })
            .catch((error) => console.error(error));
    };

    const apiUrl = `http://localhost:5173/${type}/`;

    if (!type || loading) {
        return <div>Loading...</div>; // Placeholder or loading spinner
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-3/4 m-auto">
            <h2 className="text-5xl font-semibold text-gray-700 mt-8 mb-20">
                Manage {type}
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {items.map((category) => (
                    <Link
                        to={`${apiUrl}${category.id}`}
                        key={category.id}
                        className="relative bg-white shadow-md p-4 rounded-lg flex items-center justify-between "
                    >
                        <span className="text-gray-800 font-medium">
                            {category.category || category.name || category.locations}
                        </span>
                        <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="absolute top-2 right-2 bg-red-100 p-1 rounded-full hover:bg-red-200 text-red-600"
                        >
                            🗑️
                        </button>
                    </Link>
                ))}
            </div>

            {/* New Category Form */}
            {isAdding && (
                (type === "photowalks" && <Photowalk handleUpload={itemUploaded} />) ||
                (type === "events" && <Event handleUpload={itemUploaded} />) || 
                <div className="mt-4 p-4 bg-white shadow-md rounded-lg flex flex-col gap-2">
                    <input
                        type="text"
                        className="p-2 border border-gray-300 rounded w-full"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                    />
                    <input
                        type="file"
                        className="p-2 border border-gray-300 rounded w-full"
                        onChange={(e) => setNewCategoryImage(e.target.files[0])}
                        accept="image/*"
                    />
                    
                    <button
                        onClick={handleSaveNewCategory}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            )}

            <button
                onClick={handleAddCategory}
                className="mt-6 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                + Add New Category
            </button>
        </div>
    );
}

export default Items;
