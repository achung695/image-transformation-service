import { NextRequest, NextResponse } from 'next/server';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { DeleteResponse } from '@/lib/types';

export const runtime = 'nodejs';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const { publicId } = await params;

    if (!publicId) {
      return NextResponse.json({ success: false, error: 'Missing publicId' }, { status: 400 });
    }

    // publicId comes in URL-encoded from the client (slashes encoded)
    const decodedId = decodeURIComponent(publicId);

    await deleteFromCloudinary(decodedId);

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
