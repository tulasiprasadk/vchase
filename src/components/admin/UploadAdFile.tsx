"use client";
import React, { useState } from "react";
import {
  useCloudinaryUpload,
  CloudinaryUploadResult,
} from "@/hooks/useCloudinaryUpload";

interface UploadAdFileProps {
  onUploaded?: (result: CloudinaryUploadResult) => void;
  onUploading?: (uploading: boolean) => void;
}

const UploadAdFile: React.FC<UploadAdFileProps> = ({
  onUploaded,
  onUploading,
}) => {
  const { uploadImage, uploading, progress, error } = useCloudinaryUpload();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!file) return;
    const res = await uploadImage(file, "advertisements");
    if (res) {
      onUploaded?.(res);
    }
  };

  // Auto-upload when a file is selected
  React.useEffect(() => {
    if (file) {
      // fire-and-forget; handleUpload will call onUploaded when done
      handleUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Notify parent about uploading state changes
  React.useEffect(() => {
    onUploading?.(uploading);
  }, [uploading, onUploading]);

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-col gap-2">
        {uploading ? (
          <div className="w-full">
            <div className="text-sm text-gray-700">
              Uploading {Math.round(progress)}%
            </div>
            <div className="w-full bg-gray-200 rounded h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded"
                style={{ width: `${Math.round(progress)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Select an image to upload</div>
        )}

        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default UploadAdFile;
