import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
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
    const { name, image } = body;

    if (!name || !image) {
      return NextResponse.json({ error: 'Name and Image are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const category = await Category.create({ name, image, slug });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
