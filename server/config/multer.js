import multer from "multer";
import cloudinary from "./cloudinary.js";

console.log("MULTER FILE LOADED");

const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

export const uploadToCloudinary = async (fileBuffer, folder = "prescripto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default multerUpload;
