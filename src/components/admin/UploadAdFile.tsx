"use client";
import React, { useState } from "react";
import { useCloudinaryUpload, CloudinaryUploadResult } from "@/hooks/useCloudinaryUpload";
import Button from "@/components/ui/Button";

interface UploadAdFileProps {
  onUploaded?: (result: CloudinaryUploadResult) => void;
}

const UploadAdFile: React.FC<UploadAdFileProps> = ({ onUploaded }) => {
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

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center gap-2">
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? `Uploading ${Math.round(progress)}%` : "Upload Image"}
        </Button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default UploadAdFile;
