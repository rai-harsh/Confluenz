import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 

function Items({ type }) {
    const [items, setItems] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (type) {
            axios
                .get(`/api/admin/${type}`)
                .then((response) => setItems(response.data))
                .catch((error) => console.error(error));
        }
    }, [type]);
    console.log(items);
    // Add a new category
    const handleAddCategory = () => {
        setIsAdding(true);
    };

    const handleSaveNewCategory = () => {
        axios
            .post("/api/categories", { name: newCategoryName })
            .then((response) => {
                setItems([...categories, response.data]);
                setNewCategoryName("");
                setIsAdding(false);
            })
            .catch((error) => console.error(error));
    };

    // Delete a category
    const handleDeleteCategory = (id) => {
        axios
            .delete(`/api/categories/${id}`)
            .then(() => {
                setItems(categories.filter((category) => category.id !== id));
            })
            .catch((error) => console.error(error));
    };

    const apiUrl = `http://localhost:5173/Categories/`;

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-3/4 m-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Manage {type}
            </h2>
            <div to={apiUrl} className="grid grid-cols-1  gap-4">
                {items.map((category) => (
                    <Link to={`${apiUrl}${category.category}`}
                        key={category.id}
                        className="relative bg-white shadow-md p-4 rounded-lg flex items-center justify-between"
                    >
                        <span className="text-gray-800 font-medium">
                            {category.category|| category.name ||category.locations}
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
                <div className="mt-4 p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
                    <input
                        type="text"
                        className="p-2 border border-gray-300 rounded w-full"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                    />
                    <button
                        onClick={handleSaveNewCategory}
                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
