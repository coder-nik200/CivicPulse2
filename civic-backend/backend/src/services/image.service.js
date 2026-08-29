import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Data, options = {}) {
  try {
    if (!base64Data) {
      throw new Error("No image data provided");
    }

    const uploadOptions = {
      folder: "civicpulse/issues",
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
        },
      ],
      ...options,
    };

    // If data is base64, add 'data:' prefix
    const imageData = base64Data.startsWith("data:") ? base64Data : `data:image/jpeg;base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(imageData, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      version: result.version,
      format: result.format,
      height: result.height,
      width: result.width,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

export async function uploadImageFile(fileStream, options = {}) {
  try {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: "civicpulse/issues",
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
        ...options,
      };

      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(new Error(`Failed to upload image: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            version: result.version,
            format: result.format,
            height: result.height,
            width: result.width,
            bytes: result.bytes,
          });
        }
      });

      fileStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Cloudinary stream upload error:", error);
    throw error;
  }
}

export async function generateThumbnail(publicId) {
  try {
    const url = cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: "fill",
      quality: "auto",
      fetch_format: "auto",
    });

    return url;
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    throw new Error(`Failed to generate thumbnail: ${error.message}`);
  }
}

export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Image deletion error:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

export async function getImageMetadata(publicId) {
  try {
    const resource = await cloudinary.api.resource(publicId);
    return {
      publicId: resource.public_id,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      created_at: resource.created_at,
      url: resource.secure_url,
    };
  } catch (error) {
    console.error("Get image metadata error:", error);
    throw new Error(`Failed to get image metadata: ${error.message}`);
  }
}
