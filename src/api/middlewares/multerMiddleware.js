import multer from "multer";

// Multer storage configuration
const storage = multer.memoryStorage(); // Using memory storage for Cloudinary upload

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max size
    fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'video/mp4'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type! Only JPG, JPEG, PNG, WEBP, and MP4 files are allowed.`), false);
        }
    },
});

export default upload;