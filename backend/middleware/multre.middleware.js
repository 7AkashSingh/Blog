import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            crypto.randomUUID() + path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

export const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});