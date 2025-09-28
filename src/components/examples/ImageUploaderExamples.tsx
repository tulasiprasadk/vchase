"use client";

import React, { useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { UploadResult } from "@/hooks/useImageUpload";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CldImage } from "next-cloudinary";

interface ProfileImageUploaderProps {
  initialImageUrl?: string;
  onImageUpdate?: (imageUrl: string, publicId: string) => void;
}

export function ProfileImageUploader({
  initialImageUrl,
  onImageUpdate,
}: ProfileImageUploaderProps) {
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    publicId: string;
  } | null>(initialImageUrl ? { url: initialImageUrl, publicId: "" } : null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpload = (result: UploadResult) => {
    setCurrentImage({
      url: result.url,
      publicId: result.public_id,
    });
    onImageUpdate?.(result.url, result.public_id);
  };

  const handleDelete = async () => {
    if (!currentImage?.publicId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/upload/delete?public_id=${encodeURIComponent(
          currentImage.publicId
        )}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCurrentImage(null);
        onImageUpdate?.("", "");
      } else {
        console.error("Failed to delete image");
      }
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
        uploadPreset="avatar" // This should match your Cloudinary upload preset
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
  initialImages?: Array<{ url: string; publicId: string }>;
  onImagesUpdate?: (images: Array<{ url: string; publicId: string }>) => void;
}) {
  const [images, setImages] = useState(initialImages);

  const handleUpload = (result: UploadResult) => {
    const newImages = [
      ...images,
      { url: result.url, publicId: result.public_id },
    ];
    setImages(newImages);
    onImagesUpdate?.(newImages);
  };

  const handleRemove = async (publicId: string) => {
    try {
      const response = await fetch(
        `/api/upload/delete?public_id=${encodeURIComponent(publicId)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const newImages = images.filter((img) => img.publicId !== publicId);
        setImages(newImages);
        onImagesUpdate?.(newImages);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="space-y-6">
      <ImageUpload
        onUpload={handleUpload}
        uploadPreset="event" // This should match your Cloudinary upload preset
        placeholder="Upload event images"
        multiple={true}
        maxFiles={5}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={image.publicId || index} className="p-2">
              <div className="relative">
                <CldImage
                  src={image.url}
                  alt={`Event image ${index + 1}`}
                  width={200}
                  height={128}
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(image.publicId)}
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
