"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { UploadResult } from "@/hooks/useImageUpload";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ProfileImageUploaderProps {
  initialImageUrl?: string;
  onImageUpdate?: (imageUrl: string, path: string) => void;
}

export function ProfileImageUploader({
  initialImageUrl,
  onImageUpdate,
}: ProfileImageUploaderProps) {
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    path: string;
  } | null>(initialImageUrl ? { url: initialImageUrl, path: "" } : null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpload = (result: UploadResult) => {
    setCurrentImage({
      url: result.url,
      path: result.path,
    });
    onImageUpdate?.(result.url, result.path);
  };

  const handleDelete = async () => {
    if (!currentImage?.path) return;

    setIsDeleting(true);
    try {
      // For Firebase Storage, we would need to implement a delete API
      // For now, just remove from local state
      setCurrentImage(null);
      onImageUpdate?.("", "");
      console.log("Image deletion not implemented for Firebase Storage");
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImageUpload
        onUpload={handleUpload}
        currentImageUrl={currentImage?.url}
        placeholder="Upload your profile picture"
      />

      {currentImage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700"
          >
            {isDeleting ? "Deleting..." : "Remove Image"}
          </Button>
        </div>
      )}
    </div>
  );
}

// Example usage for event images
export function EventImageUploader({
  initialImages = [],
  onImagesUpdate,
}: {
  initialImages?: Array<{ url: string; path: string }>;
  onImagesUpdate?: (images: Array<{ url: string; path: string }>) => void;
}) {
  const [images, setImages] = useState(initialImages);

  const handleUpload = (result: UploadResult) => {
    const newImages = [...images, { url: result.url, path: result.path }];
    setImages(newImages);
    onImagesUpdate?.(newImages);
  };

  const handleRemove = async (path: string) => {
    try {
      // For Firebase Storage, we would need to implement a delete API
      // For now, just remove from local state
      const newImages = images.filter((img) => img.path !== path);
      setImages(newImages);
      onImagesUpdate?.(newImages);
      console.log("Image deletion not implemented for Firebase Storage");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="space-y-6">
      <ImageUpload
        onUpload={handleUpload}
        placeholder="Upload event images"
        multiple={true}
        maxFiles={5}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={image.path || index} className="p-2">
              <div className="relative">
                <Image
                  src={image.url}
                  alt={`Event image ${index + 1}`}
                  width={200}
                  height={128}
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(image.path)}
                  className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
