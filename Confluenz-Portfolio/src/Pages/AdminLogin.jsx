import React, { useState } from 'react';
import axios from 'axios';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // For error handling
    const adminPanelUrl = "http://localhost:5174"; // Your admin panel's URL (adjust port if needed)

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', {
                username: username, // Use form values
                password: password // Use form values
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true // Allow credentials to be sent and received
            });
    
            // Redirect the user to the admin panel after login
            window.location.href = adminPanelUrl;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
        }
    };
    
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Admin Login</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>} {/* Display error message */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
