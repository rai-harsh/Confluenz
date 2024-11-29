    import React from "react";
    import axios from "axios";

    export default function Gallery(){
        const [gallery, setGallery] = React.useState([]);
        const [showForm, setShowForm] = React.useState(false);
        const [formData, setFormData] = React.useState({
            caption: '',
            orientation: 'landscape'
        });
        const [file, setFile] = React.useState(null);
        const [editingId, setEditingId] = React.useState(null);

        // FETCH IMAGES FROM GALLERY
        const fetchGallery = () => {
            axios.get('/api/admin/get/gallery')
                .then((response) => setGallery(response.data))
                .catch((error) => console.error("Error fetching gallery images:", error));
        };
        React.useEffect(() => {
            fetchGallery();
        }, []);

        // HANDLE THE FORM DATA
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };
        
        // HANDLE UPLOAD OF IMAGE
        const handleFileChange = (e) => {
            setFile(e.target.files[0]);
        };

        // HANDLE THE SUBMISSION OF FORM
        const handleSubmission = () => {
            const data = new FormData();
            data.append('caption', formData.caption);
            data.append('orientation', formData.orientation);
            data.append('image', file);
            

            axios.post('/api/admin/upload/gallery', data)
                .then(() => {
                    axios.get('/api/admin/get/gallery')
                        .then((response) => setGallery(response.data));
                    setShowForm(false);
                    setFormData({ caption: '' });
                    setFile(null);
                })
                .catch((error) =>{
                    console.error("Error uploading image:", error)
                    if (error.response && error.response.status === 400 && error.response.data.error === "File too large. Maximum size allowed is 10MB.") {
                        alert("Upload failed: The file size exceeds the 10MB limit."); // Alert for file size
                    } else {
                        alert("An error occurred while uploading the image. Please try again."); // Generic error alert
                    }
                    
                });
                
        };

        // HANDLE THE DELETION 
        const handleDelete = (id) => {
            // Optimistically update the state before making the delete request
            setGallery((prev) => prev.filter((img) => img.id !== id));
        
            axios.delete(`/api/admin/delete/gallery/${id}`)
                .then((response) => {
                    if (response.status === 200) {
                        console.log(`Image with ID ${id} successfully deleted`);
                    } else {
                        // If something went wrong, re-fetch the gallery to sync the state
                        console.error("Failed to delete image, re-fetching gallery");
                        fetchGallery(); // Re-fetch if there's an error
                    }
                })
                .catch((error) => {
                    console.error("Error deleting image:", error);
                    alert("Image couldnt be deleted ")
                    // Optionally re-fetch if there's an error
                    fetchGallery();
                });
        };

        // START EDITING
        const startEditCaption = (id) => {
            const imageToEdit = gallery.find((img) => img.id === id);
            setFormData({
                caption: imageToEdit.caption,
                orientation: imageToEdit.orientation || 'landscape' // Default to 'landscape' if undefined
            });
            setEditingId(id);
            setShowForm(true);
        };
        
        // HANDLE EDITING
        const handleEdit = () => {
            if (!formData.orientation) {
                console.error("Orientation is undefined");
                return; // Prevent submission if orientation is invalid
            }
        
            axios.put(`/api/admin/edit/gallery/${editingId}`, {
                caption: formData.caption,
                orientation: formData.orientation
            })
                .then(() => {
                    setGallery((prev) =>
                        prev.map((img) =>
                            img.id === editingId
                                ? { ...img, caption: formData.caption, orientation: formData.orientation }
                                : img
                        )
                    );
                    setEditingId(null);
                    setFormData({ caption: '', orientation: 'landscape' });
                    setShowForm(false);
                })
                .catch((error) => console.error("Error updating caption:", error));
        };
        

        return (
            <div className="p-6 flex flex-col">
                <h1 className="text-3xl mx-auto mt-10 mb-8 font-display font-bold border-b-2 sm:text-5xl text-center">Gallery</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-5/6 mx-auto">
                    {gallery.map((image) => (
                        <div key={image.id} className="relative group h-52 overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={`${image.image_url}`}
                                alt="Gallery"
                                className="w-full h-full object-cover rounded-lg shadow-sm brightness-75"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col gap-4 items-center justify-center transition-opacity">
                                <p className="text-white text-sm px-2 text-center">{image.caption}</p>
                                <p className="text-white text-sm px-2 text-center">{image.orientation}</p>
                                
                            </div>
                            <button 
                                onClick={() => handleDelete(image.id)}
                                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => startEditCaption(image.id)}
                                className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition"
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                    }}
                    className="mt-6 bg-green-600 text-white py-2 px-6 rounded-md mx-auto hover:bg-green-700 transition"
                >
                    {showForm ? "Cancel" : "Upload New Image"}
                </button>
                {showForm && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            editingId ? handleEdit() : handleSubmission();
                        }}
                        className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto space-y-6 border border-gray-200"
                    >
                        <h2 className="text-xl font-semibold text-center">
                            {editingId ? "Edit Image Caption" : "Upload New Image"}
                        </h2>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Caption</label>
                            <input
                                type="text"
                                name="caption"
                                value={formData.caption}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                        <label className="block text-gray-700">Aspect Ratio</label>
                            <select
                                name="orientation"
                                value={formData.orientation}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                required
                            >
                                {/* <option value="" disabled>Select Orientation</option> */}
                                <option value="landscape">Landscape</option>
                                <option value="portrait">Portrait</option>
                            </select>
                        </div>
                        {!editingId && (
                            <div>
                                <label className="block text-gray-700 font-medium mb-1"> Upload Image </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            {editingId ? "Save Changes" : "Upload Image"}
                        </button>
                    </form>
                )}
            </div>
        );
    }