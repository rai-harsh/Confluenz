import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRETS,
});

// Utility function for uploading an image with compression
export const uploadToCloudinary = async (filePath, folderName) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: folderName, // Automatically creates the folder if it doesn't exist
            transformation: [
                { width: 1000, crop: "limit" }, // Resizes the image while maintaining aspect ratio, without cropping
                { quality: 70 }, // Reduces quality to 70% for optimization
                { fetch_format: "auto" } // Delivers the image in the best format supported by the user's browser
            ]
            
        });
        return uploadResult;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

// Export Cloudinary instance
export default cloudinary;
