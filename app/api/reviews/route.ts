import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const publicView = searchParams.get('public');

  try {
    const productId = searchParams.get('productId');
    const query: any = {};
    if (publicView) query.isApproved = true;
    if (productId) query.productId = productId;

    const reviews = await Review.find(query).populate('productId', 'name').sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    // Basic validation
    if (!body.productId || !body.rating || !body.userName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const review = await Review.create(body);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { id, isApproved, isFeatured } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
