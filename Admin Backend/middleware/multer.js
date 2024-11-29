import multer from 'multer';
import path from 'path';
import fs from 'fs';

const baseUploadPath = path.resolve('uploads'); // Base directory for uploads

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let categoryPath;

        if (req.originalUrl.includes("/api/admin/upload/gallery")) {
            categoryPath = path.join(baseUploadPath, "gallery");
        } else if (req.originalUrl.includes("/api/admin/post/reviews")) {
            categoryPath = path.join(baseUploadPath, "reviews");
        } else if (req.originalUrl.includes("/api/admin/put/reviews")) {
            categoryPath = path.join(baseUploadPath, "reviews");
        } else if (req.originalUrl.includes("/api/society")) {
            categoryPath = path.join(baseUploadPath, "society");
        } else if (req.originalUrl.includes("/api/admin/categories/upload")) {
            categoryPath = path.join(baseUploadPath, "categories");
        } else if (req.originalUrl.includes("/api/admin/photowalks/upload")) {
            categoryPath = path.join(baseUploadPath, "photowalks");
        } else if (req.originalUrl.includes("/api/admin/events/upload")) {
            categoryPath = path.join(baseUploadPath, "events");
        } else if (req.originalUrl.includes("/api/admin/cover")) {
            categoryPath = path.join(baseUploadPath, "covers");
        } else {
            categoryPath = path.join(baseUploadPath, "misc");
        }

        // Create the directory if it doesn't exist
        if (!fs.existsSync(categoryPath)) {
            fs.mkdirSync(categoryPath, { recursive: true });
        }

        cb(null, categoryPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Configure Multer with limits
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB in bytes
    },
});

// Middleware to handle Multer errors
export const uploadMiddleware = (fieldName) => (req, res, next) => {
    const uploadSingle = upload.single(fieldName); // Call .single() here
    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: "File too large. Maximum size allowed is 10MB." });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: "File upload error." });
        } 
        next();
    });
};
