import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MemberForm() {
    const [formData, setFormData] = useState({
        member_name: "",
        position: "",
        description: "",
        instagram: "",
    });
    const [profilePic, setProfilePic] = useState(null);
    const [members, setMembers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Fetch members data from backend
    const fetchMembers = async () => {
        try {
            const response = await axios.get("/api/society");
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    useEffect(() => {
        
        fetchMembers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("member_name", formData.member_name);
        data.append("position", formData.position);
        data.append("description", formData.description);
        data.append("instagram", formData.instagram);
        if (profilePic) data.append("profile_pic", profilePic);

        try {
            if (editingId) {
                await axios.put(`/api/society/${editingId}`, data);
            } else {
                await axios.post("/api/society", data);
            }
            setEditingId(null);
            setFormData({ member_name: "", position: "", description: "", instagram: "" });
            setProfilePic(null);
            setIsFormVisible(false);
            fetchMembers();
        } catch (error) {
            console.error("Failed to submit:", error);
            if (error.response && error.response.status === 400 && error.response.data.error === "File too large. Maximum size allowed is 10MB.") {
                alert("Upload failed: The file size exceeds the 10MB limit."); // Alert for file size
            } else {
                alert("An error occurred while uploading the image. Please try again."); // Generic error alert
            }
        }
    };

    const handleEdit = (member) => {
        setEditingId(member.id);
        setFormData({
            member_name: member.member_name,
            position: member.position,
            description: member.description,
            instagram: member.instagram,
        });
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/society/${id}`);
            setMembers(members.filter((member) => member.id !== id));
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const toggleFormVisibility = () => {
        setIsFormVisible((prev) => !prev);
        setEditingId(null);
        setFormData({ member_name: "", position: "", description: "", instagram: "" });
        setProfilePic(null);
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">Society Members</h2>

            {/* Member List */}
            <div>
                {members.map((member) => (
                    <div key={member.id} className="border p-4 mb-4 rounded-md">
                        <div className="flex flex-row gap-5">
                            <div className="flex items-start flex-col w-1/4 gap-2">
                                <div className="w-16 overflow-clip h-16 rounded-lg">
                                    <img
                                    src={`${member.profile_pic}`} // Ensure this URL is correct from backend
                                    alt="Profile"
                                    className="w-full h-full rounded-lg object-cover object-center"
                                    />
                                </div>
                                <div>
                                    
                                    <h3 className="text-xl font-semibold">{member.member_name}</h3>
                                    <p className="text-gray-600">{member.position}</p>

                                </div>
                            </div>
                            <div className="w-3/4">
                                <h4 className="text-gray-700 mb-2 ">Review </h4>
                                <div className="w-1/2 h-[1px] bg-gray-300 mb-1"></div>
                                <p className="text-gray-600">{member.description}</p>
                            </div>
                        </div>
                        <div className="flex  mt-4 justify-between  ">
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(member)} className="text-blue-600 hover:underline">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:underline">
                                    Delete
                                </button>
                            </div>
                            <a href={member.instagram} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Member Button */}
            <button
                onClick={toggleFormVisibility}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
                {isFormVisible ? "Cancel" : "Add Member"}
            </button>

            {/* Member Form */}
            {isFormVisible && (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="flex flex-col">
                        <label className="text-gray-600">Name</label>
                        <input
                            type="text"
                            name="member_name"
                            value={formData.member_name}
                            onChange={handleChange}
                            className="px-4 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Position</label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="px-4 py-2 border rounded-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="px-4 py-2 border rounded-md"
                            maxLength={100}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Instagram</label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            className="px-4 py-2 border rounded-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Profile Picture</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="px-4 py-2 border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        {editingId ? "Update Member" : "Submit"}
                    </button>
                </form>
            )}
        </div>
    );
}
