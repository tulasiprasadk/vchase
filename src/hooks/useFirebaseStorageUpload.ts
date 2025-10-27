import { useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase/config";
import toast from "react-hot-toast";

export interface FirebaseUploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  contentType: string;
}

interface UseFirebaseStorageUploadReturn {
  uploadImage: (
    file: File,
    folder?: string
  ) => Promise<FirebaseUploadResult | null>;
  deleteImage: (path: string) => Promise<boolean>;
  uploading: boolean;
  progress: number;
  error: string | null;
}

export const useFirebaseStorageUpload = (): UseFirebaseStorageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
    folder: string = "images"
  ): Promise<FirebaseUploadResult | null> => {
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

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(
        /[^a-zA-Z0-9.]/g,
        "_"
      )}`;
      const storagePath = `${folder}/${fileName}`;

      // Create storage reference
      const storageRef = ref(storage, storagePath);

      // Upload file with contentType metadata
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type || "application/octet-stream",
      });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress monitoring
            const progressPercent =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progressPercent);
          },
          (error) => {
            // Handle upload errors
            console.error("Upload error:", error);
            const errorMessage = `Upload failed: ${error.message}`;
            setError(errorMessage);
            toast.error(errorMessage);
            setUploading(false);
            reject(null);
          },
          async () => {
            try {
              // Upload completed successfully
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

              setProgress(100);
              toast.success("Image uploaded successfully!");

              const result: FirebaseUploadResult = {
                url: downloadURL,
                path: storagePath,
                name: fileName,
                size: file.size,
                contentType: file.type,
              };

              setUploading(false);
              setProgress(0);
              resolve(result);
            } catch (error) {
              console.error("Error getting download URL:", error);
              const errorMessage = "Failed to get download URL";
              setError(errorMessage);
              toast.error(errorMessage);
              setUploading(false);
              reject(null);
            }
          }
        );
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      toast.error(errorMessage);
      setUploading(false);
      setProgress(0);
      return null;
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      toast.success("Image deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    progress,
    error,
  };
};
