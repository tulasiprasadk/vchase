# Cloudinary Setup Instructions

If you prefer to use Cloudinary instead of Firebase Storage, follow these steps:

## 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Note down your **Cloud Name** from the dashboard

## 2. Create Upload Preset
1. Go to Settings → Upload
2. Click "Add upload preset"
3. Set preset name (e.g., "crackers_upload")
4. Set **Signing Mode** to "Unsigned"
5. Set **Folder** to "crackers" (optional)
6. Save the preset

## 3. Environment Variables
Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name_here
```

## 4. Switch Back to Cloudinary (Optional)
If you want to use Cloudinary instead of Firebase Storage:

1. In `src/pages/crackers/admin-dashboard.tsx`, change:
   ```typescript
   import { useFirebaseImageUpload } from "@/hooks/useFirebaseImageUpload";
   ```
   to:
   ```typescript
   import { useImageUpload } from "@/hooks/useImageUpload";
   ```

2. Change the hook usage:
   ```typescript
   const { uploadImage, isUploading } = useImageUpload();
   ```

3. Do the same for `src/pages/crackers/payment.tsx`

## Current Setup
✅ **Firebase Storage** is currently configured and working
✅ **No additional setup required** - Firebase is already configured in your project
✅ **Automatic folder organization** - QR codes go to "qr-codes/" folder, screenshots to "transaction-screenshots/"
