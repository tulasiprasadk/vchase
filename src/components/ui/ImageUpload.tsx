"use client";

import React, { useCallback, useState, useRef } from "react";
import Image from "next/image";
import { useImageUpload, type UploadResult } from "@/hooks/useImageUpload";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ImageUploadProps {
  onUpload: (result: UploadResult) => void;
  currentImageUrl?: string;
  currentImageAlt?: string;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export function ImageUpload({
  onUpload,
  currentImageUrl,
  currentImageAlt = "Uploaded image",
  placeholder = "Click to upload an image",
  className = "",
  multiple = false,
  maxFiles = 1,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, uploadProgress } = useImageUpload();

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const filesToUpload = multiple
        ? Array.from(files).slice(0, maxFiles)
        : [files[0]];

      for (const file of filesToUpload) {
        const result = await uploadImage(file);
        if (result) {
          onUpload(result);
        }
      }
    },
    [uploadImage, onUpload, multiple, maxFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const filesToUpload = multiple
        ? imageFiles.slice(0, maxFiles)
        : [imageFiles[0]];

      for (const file of filesToUpload) {
        if (file) {
          const result = await uploadImage(file);
          if (result) {
            onUpload(result);
          }
        }
      }
    },
    [uploadImage, onUpload, multiple, maxFiles]
  );

  const handleClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${isUploading ? "cursor-not-allowed opacity-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {currentImageUrl ? (
          <div className="space-y-4">
            <div className="relative max-w-xs mx-auto">
              <Image
                src={currentImageUrl}
                alt={currentImageAlt}
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-48"
              />
            </div>
            <p className="text-sm text-gray-600">
              Click or drag a new image to replace
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-600 mb-2">{placeholder}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Choose file"}
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Supported formats: JPEG, PNG, WebP</p>
        <p>Maximum file size: 5MB</p>
        {multiple && <p>Maximum files: {maxFiles}</p>}
      </div>
    </Card>
  );
}
