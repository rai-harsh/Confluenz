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

// Export the configured Multer instance
export const upload = multer({ storage });
