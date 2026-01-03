import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SiteContent } from '@/models/SiteContent';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();
  try {
    const content = await SiteContent.findOne({});
    return NextResponse.json(content?.heroImages || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero images' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { images } = await req.json();
    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'Images must be an array' }, { status: 400 });
    }

    // Upsert the singleton document
    const content = await SiteContent.findOneAndUpdate(
      {},
      { heroImages: images },
      { new: true, upsert: true }
    );
    return NextResponse.json(content.heroImages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hero images' }, { status: 500 });
  }
}
