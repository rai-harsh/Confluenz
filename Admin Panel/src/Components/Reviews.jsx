import { useState, useEffect } from "react";
import axios from "axios";

const Reviews = () => {
    
    const [reviews, setReviews] = useState([]);
    const [username, setUsername] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [editingId, setEditingId] = useState(null);
    const [file, setFile]= useState(null)

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const response = await axios.get("/api/admin/get/reviews");
        setReviews(response.data);
    };
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAddOrEditReview = async () => {
        
        const formData = new FormData();
            formData.append('profile_pic', file);
            formData.append('review_text', reviewText);
            formData.append('username', username);
            formData.append('rating', rating);

        if (editingId) {
            
            const response = await axios.put(`/api/admin/put/reviews/${editingId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchReviews();
            setEditingId(null);

        } else {
        
            try {
                const response = await axios.post(`/api/admin/post/reviews`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                
                // Add the new review to the state
                setReviews((prevReviews) => [...prevReviews, response.data]);
    
            } catch (error) {
                console.error('Error adding image:', error);
            }
        }
        
        setFile(null);
        setUsername("");
        setReviewText("");
        setRating(5);
    };

    const handleDeleteReview = async (id) => {
        await axios.delete(`/api/admin/reviews/${id}`);
        setReviews(reviews.filter((review) => review.id !== id));
    };

 

    return (
        <>
        <h2 className="text-5xl font-bold text-center mb-4 mt-40 mb-16">Reviews</h2>
        <div className="p-6 bg-gray-100 rounded-md shadow-lg max-w-2xl mx-auto ">

            <div className = "flex flex-col mb-6 space-y-3">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="p-2 border border-gray-300 rounded-md"
                />
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                    className="p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                />
                <input
                    type="file"
                    onChange={handleFileChange} 
                />
                <button
                    onClick={handleAddOrEditReview}
                    
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    {editingId ? "Update Review" : "Add Review"}
                </button>
                
                
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-gray-300 rounded-md">
                        <div className="flex justify-between items-center mb-2">   
                            <div className="w-16 overflow-clip h-16 rounded-lg">    
                                <img src={`http://localhost:4000${review.profile_pic}`} className="w-full h-full rounded-lg object-cover object-center" alt="" />
                            </div>
                            <h3 className="font-semibold">{review.username}</h3>
                            <div className="text-sm text-gray-500">Rating: {review.rating}</div>
                        </div>
                        <p className="text-gray-700">{review.review_text}</p>
                        <div className="flex justify-end space-x-2 mt-2">
                            <button
                                onClick={() => {
                                    setEditingId(review.id);
                                    setUsername(review.username); // Prefill username
                                    setReviewText(review.review_text);
                                    setRating(review.rating);
                                    setFile(review.profile_pic);
                                }}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default Reviews;
