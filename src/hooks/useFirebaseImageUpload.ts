import { useState, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";
import { toast } from "react-hot-toast";

export interface UploadResult {
  url: string;
  public_id: string;
}

export interface UseFirebaseImageUploadOptions {
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  folder?: string; // Firebase Storage folder
}

export function useFirebaseImageUpload(options: UseFirebaseImageUploadOptions = {}) {
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
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const fileName = `${timestamp}_${randomString}.${fileExtension}`;
        
        // Create storage reference
        const storageRef = ref(storage, `${folder}/${fileName}`);
        
        // Upload file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        

        setUploadProgress(100);
        toast.success("Image uploaded successfully!");

        return {
          url: downloadURL,
          public_id: snapshot.ref.fullPath, // Use full path as public_id
        };
      } catch (error) {
        console.error("🚨 Firebase upload error:", error);
        toast.error("Upload failed. Please try again.");
        return null;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
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
