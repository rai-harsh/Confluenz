import { v2 as cloudinary } from 'cloudinary';

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
                {
                    width: 800, // Resize width
                    height: 800, // Resize height
                    crop: "limit", // Limit the resizing to fit within the dimensions
                },
                {
                    quality: "auto", // Automatically optimize image quality
                },
            ],
        });
        return uploadResult;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

// Export Cloudinary instance
export default cloudinary;
