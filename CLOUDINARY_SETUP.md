# Cloudinary Integration Setup

## URGENT: Create Upload Preset to Fix Current Error

**You're getting "Upload preset not found" because the preset needs to be created in your Cloudinary account.**

### Quick Fix Steps:

1. **Log into Cloudinary Console**

   - Go to https://cloudinary.com/console
   - Sign in with your account (cloud name: dq8ky7xw9)

2. **Create Upload Preset**

   - Click Settings (⚙️) → Upload tab
   - Click "Add upload preset"
   - Set **Preset name** to: `events_preset` (exactly as shown)
   - Set **Signing Mode** to: `Unsigned`
   - Set **Folder** to: `events`
   - Click "Save"

3. **Restart Dev Server**

   ```bash
   npm run dev
   ```

4. **Test Image Upload**
   - Go to Dashboard → Events → Create Event
   - Try uploading an image
   - Should work immediately after creating the preset

---

## Full Setup Documentation

### 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. Once logged in, go to your Dashboard
3. Copy the following credentials:
   - Cloud Name
   - API Key
   - API Secret

### 2. Configure Environment Variables

Add these variables to your `.env.local` file:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Create Upload Presets

In your Cloudinary dashboard:

1. Go to Settings → Upload
2. Create the following upload presets:

#### Avatar Preset

- Preset name: `avatar`
- Signing mode: `Unsigned`
- Folder: `event-sponsor-platform/avatars`
- Transformation: Width 400, Height 400, Crop: Fill, Gravity: Face
- Format: WebP, Quality: Auto

#### Event Images Preset

- Preset name: `event`
- Signing mode: `Unsigned`
- Folder: `event-sponsor-platform/events`
- Transformation: Width 1200, Height 600, Crop: Fill
- Format: WebP, Quality: Auto

#### Logo Preset

- Preset name: `logo`
- Signing mode: `Unsigned`
- Folder: `event-sponsor-platform/logos`
- Transformation: Width 400, Height 400, Crop: Fit
- Format: PNG, Quality: Auto

## Usage Examples

### Basic Image Upload

```tsx
import { ImageUpload } from "@/components/ui/ImageUpload";
import { UploadResult } from "@/hooks/useImageUpload";

function MyComponent() {
  const handleUpload = (result: UploadResult) => {
    console.log("Image uploaded:", result.url);
    // Save the URL to your database
  };

  return (
    <ImageUpload
      onUpload={handleUpload}
      uploadPreset="avatar"
      placeholder="Upload your profile picture"
    />
  );
}
```

### Profile Image Uploader

```tsx
import { ProfileImageUploader } from "@/components/examples/ImageUploaderExamples";

function ProfilePage() {
  const handleImageUpdate = (imageUrl: string, publicId: string) => {
    // Update user profile in database
    console.log("New image:", imageUrl);
  };

  return (
    <ProfileImageUploader
      initialImageUrl={user.profileImage}
      onImageUpdate={handleImageUpdate}
    />
  );
}
```

### Multiple Event Images

```tsx
import { EventImageUploader } from "@/components/examples/ImageUploaderExamples";

function CreateEventPage() {
  const handleImagesUpdate = (
    images: Array<{ url: string; publicId: string }>
  ) => {
    // Save images to event in database
    console.log("Event images:", images);
  };

  return (
    <EventImageUploader
      initialImages={event.images || []}
      onImagesUpdate={handleImagesUpdate}
    />
  );
}
```

## API Endpoints

### Upload Image

- **POST** `/api/upload`
- **Body**: FormData with `file` and optional `type`
- **Response**: `{ success: true, url: string, public_id: string }`

### Delete Image

- **DELETE** `/api/upload/delete?public_id=IMAGE_PUBLIC_ID`
- **Response**: `{ success: true, result: object }`

## Server-Side Usage

```tsx
import { uploadToCloudinary, uploadOptions } from "@/lib/cloudinary";

// In an API route
const buffer = Buffer.from(await file.arrayBuffer());
const result = await uploadToCloudinary(buffer, uploadOptions.avatar);
console.log("Uploaded to:", result.url);
```

## File Validation

The system automatically validates:

- File type (images only)
- File size (max 5MB)
- Supported formats: JPEG, PNG, WebP

## Features

- ✅ Drag and drop upload
- ✅ Click to upload
- ✅ Upload progress indicator
- ✅ Image preview
- ✅ Multiple file upload support
- ✅ Server-side and client-side upload options
- ✅ Automatic image optimization
- ✅ Folder organization
- ✅ Delete functionality

## Folder Structure

Images are organized in Cloudinary as:

```
event-sponsor-platform/
├── avatars/          # User profile pictures
├── events/           # Event images
├── logos/            # Sponsor logos
├── documents/        # Document attachments
└── general/          # Other uploads
```

## Security Notes

- Upload presets should be configured as `Unsigned` for client-side uploads
- API keys are only used for server-side operations
- Never expose your API Secret in client-side code
- Consider implementing additional validation on the server side
- Set up folder restrictions in your Cloudinary settings

## Troubleshooting

### Common Issues

1. **Upload Preset Not Found**

   - Ensure you created the upload preset in Cloudinary
   - Check that the preset name matches exactly
   - Verify the preset is set to "Unsigned"

2. **CORS Errors**

   - Add your domain to Cloudinary's allowed origins
   - Check that your environment variables are set correctly

3. **File Size Errors**

   - Default limit is 5MB, adjust in the validation if needed
   - Check Cloudinary account limits

4. **Environment Variables Not Working**
   - Ensure `.env.local` is in your project root
   - Restart your development server after adding variables
   - Variables starting with `NEXT_PUBLIC_` are client-side accessible

## Best Practices

1. Always validate files on both client and server side
2. Use appropriate transformations for different use cases
3. Implement proper error handling
4. Show upload progress to users
5. Optimize images for web delivery
6. Clean up unused images periodically
7. Use meaningful folder structures
8. Consider implementing image compression before upload
