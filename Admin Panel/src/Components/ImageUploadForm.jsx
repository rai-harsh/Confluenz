import React, { useState } from 'react';
import axios from 'axios';

const ImageUploadForm = () => {
    const [formData, setFormData] = useState({
    description: '',
    aspectRatio: '',
    grading: '',
    type: '',
    category: '',
    typeId: ''
});
const [file, setFile] = useState(null);
const [typeIds, setTypeIds] = useState ({ events: [], walk: [] });

 
// Load existing photowalks and events 

  React.useEffect(() => {
    
    axios.get('/api/typeId')
    .then(response => {
        setTypeIds(response.data); // Assumes the response has { events: [...], photowalks: [...] }
        
    })
    .catch(error => console.error('Error loading type IDs:', error));
}, []);

const events = typeIds.events.map((item)=>{
  return (
    <option value={item.venue}>{item.venue}</option>
  )
})
const walks = typeIds.walk.map((item)=>{
  return (
    <option value={item.locations}>{item.locations}</option>
  )
})


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
    

    // Prepare form data for upload
    const uploadData = new FormData();
    uploadData.append('description', formData.description);
    uploadData.append('aspectRatio', formData.aspectRatio);
    uploadData.append('grading', formData.grading);
    uploadData.append('type', formData.type);
    uploadData.append('category', formData.category);
    uploadData.append('typeId', formData.typeId);
    if (file) uploadData.append('file', file);

    // Submit to backend endpoint
    axios.post('/api/uploadImage', uploadData)
    .then(response => {
        alert('Image uploaded successfully!');
        console.log(response.data);
    })
    .catch(error => console.error('Error uploading image:', error));
};

return (
  <>
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white  shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold text-center mb-6">Upload Image</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
        <label className="block text-gray-700">Description</label>
        <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
        />
        </div>
        
        <div>
        <label className="block text-gray-700">Aspect Ratio</label>
        <select
            name="aspectRatio"
            value={formData.aspectRatio}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
        >
            <option value="" disabled>Select Aspect Ratio</option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
        </select>
        </div>
        
        <div>
        <label className="block text-gray-700">Grading</label>
        <input
            type="text"
            name="grading"
            value={formData.grading}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
        />
        </div>
        
        <div>
        <label className="block text-gray-700">Type</label>
        <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
        >
            <option value="" disabled>Select Type</option>
            <option value="Event">Event</option>
            <option value="Photowalk">Photowalk</option>
            <option value="Workshop">Workshop</option>
            <option value="Personal">Personal</option>
        </select>
        </div>
        
        <div>
        <label className="block text-gray-700">Category</label>
        <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
        >
            
            <option value="Architectural">Architectural</option>
            <option value="Portrait">Portrait</option>
            <option value="Dance">Dance</option>
            <option value="Street">Street</option>
            <option value="Conference">Conference</option>
            <option value="Fashion">Fashion</option>
            <option value="Sports">Sports</option>
            <option value="Product">Product</option>
            <option value="Family-function">Family-function</option>
            <option value="Concert">Concert</option>
        </select>
        </div>
        
        <div className={` ${formData.type==='Event' || formData.type==='Photowalk'? '': 'hidden'} `}>

        <label className="block text-gray-700">{ ` ${formData.type} name :`}</label>
        <select
            name="typeId"
            value={formData.typeId}
            onChange={handleInputChange}
            className= "w-full mt-1 p-2 border border-gray-300 rounded-md "
            required
        >
            
            {formData.type==='Event' ? events : walks}
        </select>
        </div>

        <div>
          <label className="block text-gray-700">Upload Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            
          />
        </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-150">
          Upload Image
        </button>
      </form>
    </div>
    </>
  );
};

export default ImageUploadForm;
