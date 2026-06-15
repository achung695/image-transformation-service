# Image Transformation Service

A full-stack Next.js app that removes the background from an uploaded image, flips it horizontally, hosts the result on Cloudinary, and provides a shareable URL.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Background Removal**: [remove.bg API](https://www.remove.bg/api)
- **Image Processing**: [sharp](https://sharp.pixelplumbing.com/) (horizontal flip)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Features

- Drag-and-drop or click-to-upload image input
- Real-time processing steps indicator (upload → remove bg → flip → host)
- Checkerboard preview for transparency
- One-click URL copy
- Image deletion from Cloudinary

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd <repo-name>
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
REMOVEBG_API_KEY=your_removebg_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Getting API keys:
- **remove.bg**: Sign up at [remove.bg](https://www.remove.bg/users/sign_up) → API Keys → free tier gives 50 credits/month
- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com/users/register/free) → Dashboard shows your cloud name, API key, and secret

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel project settings
4. Deploy — done!

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/process` | Upload image (multipart `image` field), returns `{ url, publicId }` |
| `DELETE` | `/api/image/:publicId` | Delete image from Cloudinary |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── process/route.ts       # Image processing endpoint
│   │   └── image/[publicId]/route.ts  # Delete endpoint
│   ├── page.tsx                   # Main UI page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ImageUploader.tsx          # Drag-and-drop upload
│   ├── ProcessingStatus.tsx       # Step indicator
│   └── ResultCard.tsx             # Result display + copy/delete
└── lib/
    ├── cloudinary.ts              # Upload/delete helpers
    ├── imageProcessor.ts          # remove.bg + sharp flip
    └── types.ts                   # Shared TypeScript types
```
