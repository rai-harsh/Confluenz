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
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [deleteWarning, setDeleteWarning] = useState(null); // Track delete warning

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
            .post(`/api/admin/cover/add${type}`, formData, {
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
            .catch((error) =>{ 
                console.error(error)
                if (error.response && error.response.status === 400 && error.response.data.error === "File too large. Maximum size allowed is 10MB.") {
                    alert("Upload failed: The file size exceeds the 10MB limit."); // Alert for file size
                } else {
                    alert("An error occurred while uploading the image. Please try again."); // Generic error alert
                }
            });
    };

    const handleEditCategory = (id, name) => {
        setEditCategoryId(id);
        setNewCategoryName(name);
    };

    const handleSaveEdit = () => {
        const formData = new FormData();
        formData.append("name", newCategoryName);

        if (newCategoryImage) {
            formData.append("file", newCategoryImage);
        }

        axios
            .put(`/api/admin/cover/${type}/${editCategoryId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                fetchItems();
                setEditCategoryId(null);
                setNewCategoryName("");
            })
            .catch((error) =>{ 
                console.error(error)
                if (error.response && error.response.status === 400 && error.response.data.error === "File too large. Maximum size allowed is 10MB.") {
                    alert("Upload failed: The file size exceeds the 10MB limit."); // Alert for file size
                } else {
                    alert("An error occurred while uploading the image. Please try again."); // Generic error alert
                }
            });
    };

    const handleDeleteCategory = (id) => {
        axios
            .get(`/api/admin/count/${type}/${id}`)
            .then((response) => {
                // Use response data directly to decide whether to show the delete confirmation
                if (response.data.num > 0) {
                    alert(`You cannot delete this category unless content size is 0. Current size: ${response.data.num}`);
                } else {
                    setDeleteWarning(id); // Show delete confirmation only if content size is 0
                }
            })
            .catch((error) => console.error(error));
    };
    

    const confirmDelete = (id) => {
        axios
            .delete(`/api/admin/delete/${type}/${id}`)
            .then(() => {
                setItems(items.filter((category) => category.id !== id));
                setDeleteWarning(null);
            })
            .catch((error) => console.error(error));
    };

    const apiUrl = `${window.location.origin}/${type}/`;

    if (!type || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-3/4 m-auto">
            <h2 className="text-5xl font-semibold text-gray-700 mt-8 mb-20">
                Manage {type}
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {items.map((category) => (
                    <div className="flex flex-col gap-3" key={category.id}>
                        <div className="flex flex-row">
                        <Link
                            to={`${apiUrl}${category.id}`}
                            className="relative w-11/12 bg-white shadow-md p-4 rounded-lg flex items-center justify-between"
                        >
                            <span className="text-gray-800 font-medium">
                                {category.category || category.name || category.locations}
                            </span>
                        </Link>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEditCategory(category.id, category.category || category.name || category.locations)}
                                className="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 text-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-3 bg-red-100 rounded-lg hover:bg-red-200 text-red-600"
                            >
                                🗑️
                            </button>
                        </div>
                        </div>
                        {editCategoryId === category.id && (
                            <div className="w-full mt-2 p-4 bg-gray-200 mb-3 shadow-md rounded-lg">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    placeholder="Edit category name"
                                />
                                
                                <h4 className="mt-2 text-md font-medium ml-1">Cover Image</h4>
                                <input
                                    type="file"
                                    className="p-2 border bg-white border-gray-300 rounded w-full"
                                    onChange={(e) => setNewCategoryImage(e.target.files[0])}
                                    accept="image/*"
                                />
                                <button
                                    onClick={handleSaveEdit}
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditCategoryId(null)}
                                    className="ml-5 mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        {deleteWarning === category.id && (
                            <div className="w-full mt-2 p-4 bg-white shadow-md rounded-lg">
                                <p>Are you sure you want to delete this category?</p>
                                <button
                                    onClick={() => confirmDelete(category.id)}
                                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setDeleteWarning(null)}
                                    className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
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
