import React from "react";
export default function ImageForm(props){
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-lg w-11/12 sm:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
            <input type="file" onChange={props.handleFileChange} className="mb-4" />
            <div className="flex justify-end">
                <button
                    onClick={props.onClose}
                    className="text-gray-600 hover:text-gray-800 px-3 py-1 mr-2"
                >
                    Cancel
                </button>
                <button
                    onClick={props.handleAddImage}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                >
                    Upload
                </button>
            </div>
        </div>
    </div>
    )
}