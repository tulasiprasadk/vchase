import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export interface UploadResult {
  url: string;
  public_id: string;
}

export interface UseImageUploadOptions {
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  uploadPreset?: string;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
    uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
      "default",
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxFileSize) {
        return `File size must be less than ${Math.round(
          maxFileSize / 1024 / 1024
        )}MB`;
      }

      if (!acceptedTypes.includes(file.type)) {
        return `File type must be one of: ${acceptedTypes.join(", ")}`;
      }

      return null;
    },
    [maxFileSize, acceptedTypes]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return null;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

        const xhr = new XMLHttpRequest();

        return new Promise<UploadResult>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(progress);
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve({
                url: response.secure_url,
                public_id: response.public_id,
              });
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Upload failed"));
          });

          xhr.open("POST", cloudinaryUrl);
          xhr.send(formData);
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please try again.");
        return null;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [validateFile, uploadPreset]
  );

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<UploadResult[]> => {
      const results: UploadResult[] = [];

      for (const file of files) {
        const result = await uploadImage(file);
        if (result) {
          results.push(result);
        }
      }

      return results;
    },
    [uploadImage]
  );

  return {
    uploadImage,
    uploadMultiple,
    isUploading,
    uploadProgress,
    validateFile,
  };
}
