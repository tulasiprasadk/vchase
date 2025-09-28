import { useState } from "react";
import toast from "react-hot-toast";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface UseCloudinaryUploadReturn {
  uploadImage: (file: File) => Promise<CloudinaryUploadResult | null>;
  uploading: boolean;
  progress: number;
  error: string | null;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (
    file: File
  ): Promise<CloudinaryUploadResult | null> => {
    if (!file) {
      toast.error("Please select a file to upload");
      return null;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return null;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return null;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      // Use a default preset name - you'll need to create this in Cloudinary
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!uploadPreset || uploadPreset === "your_upload_preset") {
        toast.error(
          "Cloudinary upload preset not configured. Please check your environment variables."
        );
        throw new Error("Upload preset not configured");
      }

      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "events");

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      setProgress(100);
      toast.success("Image uploaded successfully!");

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadImage,
    uploading,
    progress,
    error,
  };
};
