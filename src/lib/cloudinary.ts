import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

// Upload options for different types of images
export const uploadOptions = {
  // For user avatars
  avatar: {
    folder: "event-sponsor-platform/avatars",
    width: 400,
    height: 400,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    format: "webp",
  },
  // For event images
  event: {
    folder: "event-sponsor-platform/events",
    width: 1200,
    height: 600,
    crop: "fill",
    quality: "auto",
    format: "webp",
  },
  // For sponsor logos
  logo: {
    folder: "event-sponsor-platform/logos",
    width: 400,
    height: 400,
    crop: "fit",
    quality: "auto",
    format: "png",
    background: "transparent",
  },
  // For documents/attachments
  document: {
    folder: "event-sponsor-platform/documents",
    resource_type: "raw" as const,
  },
};

// Upload options type
export interface CloudinaryUploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string;
  format?: string;
  background?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
  [key: string]: unknown;
}

// Upload function for server-side use
export async function uploadToCloudinary(
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          ...options,
          resource_type: options.resource_type || "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        }
      )
      .end(buffer);
  });
}

// Delete function
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}

export default cloudinary;
