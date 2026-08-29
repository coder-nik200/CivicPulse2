import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Accepts a base64 data URL string directly — Cloudinary supports this natively
export async function uploadBase64Image(base64DataUrl) {
  const result = await cloudinary.uploader.upload(base64DataUrl, {
    folder: "civicpulse-issues",
  });
  return result.secure_url;
}
