import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../auth/[...nextauth]/route';

export const runtime = 'nodejs';

const ALLOWED_FOLDERS = new Set(['products', 'categories', 'reviews']);
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

const getExtensionFromMimeType = (mimeType: string) => {
  switch (mimeType) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    default:
      return null;
  }
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || '').trim();

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: 'Invalid upload folder' }, { status: 400 });
    }

    // Public users can upload review photos; admin session is required for catalog images.
    if (folder !== 'reviews') {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file was uploaded' }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Image exceeds 8MB limit' },
        { status: 400 },
      );
    }

    const extension = getExtensionFromMimeType(file.type);
    if (!extension) {
      return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
    }

    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    const absoluteFilePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });

    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(absoluteFilePath, bytes);

    const publicUrl = path.posix.join('/uploads', folder, fileName);
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
