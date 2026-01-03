import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SiteContent } from '@/models/SiteContent';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();
  try {
    const content = await SiteContent.findOne({});
    return NextResponse.json({
      influencerVideos: content?.influencerVideos || [],
      dispatchVideos: content?.dispatchVideos || [],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await req.json();
    const { type, video } = body; // type: 'influencer' | 'dispatch'

    if (!type || !video) {
      return NextResponse.json({ error: 'Type and Video data are required' }, { status: 400 });
    }

    const updateQuery = type === 'influencer'
      ? { $push: { influencerVideos: video } }
      : { $push: { dispatchVideos: video } };

    const content = await SiteContent.findOneAndUpdate(
      {},
      updateQuery,
      { new: true, upsert: true }
    );

    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ error: 'ID and Type are required' }, { status: 400 });
    }

    const updateQuery = type === 'influencer'
      ? { $pull: { influencerVideos: { _id: id } } }
      : { $pull: { dispatchVideos: { _id: id } } };

    await SiteContent.findOneAndUpdate({}, updateQuery);
    return NextResponse.json({ message: 'Video deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
