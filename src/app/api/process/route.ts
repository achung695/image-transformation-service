import { NextRequest, NextResponse } from 'next/server';
import { processImage } from '@/lib/imageProcessor';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { ProcessResponse, ErrorResponse } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']; // jpeg, jpg, png, webp

export async function POST(request: NextRequest): Promise<NextResponse<ProcessResponse | ErrorResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(new Uint8Array(arrayBuffer));

    // Step 1 + 2: Remove background & flip
    const processedBuffer = await processImage(inputBuffer, file.type);

    // Step 3: Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(processedBuffer);

    return NextResponse.json({ success: true, url, publicId });
  } catch (error: unknown) {
    console.error('Processing error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';

    if (message.includes('remove.bg') || message.includes('402')) {
      return NextResponse.json(
        { success: false, error: 'Background removal failed. Please check your API key or credits.' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Image processing failed. Please try again.' },
      { status: 500 }
    );
  }
}