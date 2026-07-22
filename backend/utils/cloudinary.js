import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "blog-app",
        });

        // Delete local file after successful upload
        await fs.unlink(localFilePath);

        return response;
    } catch (error) {
        // Delete local file even if upload fails
        try {
            await fs.unlink(localFilePath);
        } catch (_) {}

        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete error:", error.message);
    }
};

export {
    cloudinary,
    uploadOnCloudinary,
    deleteFromCloudinary,
};