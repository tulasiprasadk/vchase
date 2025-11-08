# Cloudinary Configuration

## Quick Setup Checklist

- [ ] Sign up at [cloudinary.com](https://cloudinary.com)
- [ ] Note your Cloud Name: `________________`
- [ ] Create upload preset named: `events_preset`
- [ ] Set Signing Mode: `Unsigned`
- [ ] Set Folder: `events`
- [ ] Add environment variables to `.env.local`

## Environment Variables

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Upload Preset Configuration

**Preset Name**: `events_preset`
**Signing Mode**: Unsigned
**Folder**: `events`
**Use filename**: Yes
**Unique filename**: Yes

## Troubleshooting

**Error: "Upload preset not found"**

- Verify preset name is exactly `events_preset`
- Check Signing Mode is set to `Unsigned`
- Restart development server after creating preset
