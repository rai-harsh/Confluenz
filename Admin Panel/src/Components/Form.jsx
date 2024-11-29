import React, { useState } from 'react';
import axios from 'axios';

const Form = (props) => {
    const [formData, setFormData] = useState({
    name:'',
    description: '',
    location: '',   //Stores venue for event
    genre: '',
    date:''
});
const [file, setFile] = useState(null);

  // Handle input change
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData)
};

  // Handle file selection
const handleFileChange = (e) => {
    setFile(e.target.files[0]);
};

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('description', formData.description);
    uploadData.append('location', formData.location);
    uploadData.append('genre', formData.genre);
    uploadData.append('name', formData.name);
    uploadData.append('date', formData.date);
    if (file) uploadData.append('file', file);

    axios.post(`/api/admin/cover/add${props.category}`, uploadData)
        .then(response => {
            alert('Image uploaded successfully!');
            props.handleUpload(); // Trigger the update only after success
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            if (error.response && error.response.status === 400 && error.response.data.error === "File too large. Maximum size allowed is 10MB.") {
              alert("Upload failed: The file size exceeds the 10MB limit."); // Alert for file size
          } else {
              alert("An error occurred while uploading the image. Please try again."); // Generic error alert
          }
        });
};


return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white  shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-center mb-6">Add {props.category} </h2>
    <form onSubmit={handleSubmit} className="space-y-4">
        
        {
          (props.category==='photowalk') ||
          <div>
            <label className="block text-gray-700">Event Name </label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
            />
          </div>
        }

        <div>
        <label className="block text-gray-700">{props.category==='photowalk' ? "Location " : "Venue " }</label>
        <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
        />
        </div>
        <div>
        <label className="block text-gray-700">Genre</label>
        <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
        />
        </div>
        
        <div>
        <label className="block text-gray-700">Description</label>
        <textarea
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
            maxLength={100}
        />
        </div>
        

        <div>
          <label className="block text-gray-700">Upload Cover Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            
          />
        </div>
        <div>
        <label className="block text-gray-700">Date</label>
        <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
        />
        </div>
        
        <button  type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150">
          Upload {props.category}
        </button>
      </form>
    </div>
  );
};

export default Form;
