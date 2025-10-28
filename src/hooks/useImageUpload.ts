import { useState, useCallback } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";
import { toast } from "react-hot-toast";

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  contentType: string;
}

export interface UseImageUploadOptions {
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  folder?: string;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
    folder = "images",
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
        // Create a unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(
          /[^a-zA-Z0-9.]/g,
          "_"
        )}`;
        const storagePath = `${folder}/${fileName}`;

        // Create storage reference
        const storageRef = ref(storage, storagePath);

        // Upload file
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<UploadResult>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progress monitoring
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              // Handle upload errors
              console.error("Upload error:", error);
              const errorMessage = `Upload failed: ${error.message}`;
              toast.error(errorMessage);
              setIsUploading(false);
              setUploadProgress(0);
              reject(null);
            },
            async () => {
              try {
                // Upload completed successfully
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );

                toast.success("Image uploaded successfully!");

                const result: UploadResult = {
                  url: downloadURL,
                  path: storagePath,
                  name: fileName,
                  size: file.size,
                  contentType: file.type,
                };

                setIsUploading(false);
                setUploadProgress(0);
                resolve(result);
              } catch (error) {
                console.error("Error getting download URL:", error);
                const errorMessage = "Failed to get download URL";
                toast.error(errorMessage);
                setIsUploading(false);
                setUploadProgress(0);
                reject(null);
              }
            }
          );
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please try again.");
        setIsUploading(false);
        setUploadProgress(0);
        return null;
      }
    },
    [validateFile, folder]
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
