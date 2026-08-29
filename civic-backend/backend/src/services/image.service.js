import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* =========================================================
   UPLOAD BASE64 IMAGE
========================================================= */

export async function uploadImage(base64Data, options = {}) {
  try {
    if (!base64Data) {
      throw new Error("No image data provided");
    }

    const uploadOptions = {
      folder: "CivicFix/issues",
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
      ...options,
    };

    const imageData = base64Data.startsWith("data:")
      ? base64Data
      : `data:image/jpeg;base64,${base64Data}`;

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

    throw new Error(
      `Failed to upload image: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/* =========================================================
   UPLOAD MULTER FILE
========================================================= */

export async function uploadImageFile(file, options = {}) {
  try {
    if (!file) {
      throw new Error("No image file provided");
    }

    if (!file.buffer) {
      throw new Error("Uploaded file buffer is missing");
    }

    const uploadOptions = {
      folder: "CivicFix/issues",
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
      ...options,
    };

    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Cloudinary stream upload error:", error);

            return reject(
              new Error(`Failed to upload image: ${error.message}`),
            );
          }

          if (!result?.secure_url) {
            return reject(new Error("Cloudinary returned no image URL"));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            version: result.version,
            format: result.format,
            height: result.height,
            width: result.width,
            bytes: result.bytes,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Cloudinary file upload error:", error);

    throw new Error(
      `Failed to upload image: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/* =========================================================
   UPLOAD ISSUE IMAGE
========================================================= */

/*
 * This is the function your issue controller uses:
 *
 * uploadIssueImage(req.file)
 */

export async function uploadIssueImage(file) {
  return uploadImageFile(file, {
    folder: "CivicFix/issues",
    resource_type: "image",
  });
}

/* =========================================================
   GENERATE THUMBNAIL
========================================================= */

export function generateThumbnail(publicId) {
  if (!publicId) {
    throw new Error("Public ID is required");
  }

  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width: 300,
        height: 300,
        crop: "fill",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
}

/* =========================================================
   DELETE IMAGE
========================================================= */

export async function deleteImage(publicId) {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return result.result === "ok";
  } catch (error) {
    console.error("Image deletion error:", error);

    throw new Error(
      `Failed to delete image: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/* =========================================================
   GET IMAGE METADATA
========================================================= */

export async function getImageMetadata(publicId) {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

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

    throw new Error(
      `Failed to get image metadata: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
