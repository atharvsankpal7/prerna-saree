import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get('category');

  try {
    let query = {};
    if (categorySlug) {
      // We need to find the category ID first, or populate and filter.
      // Better to populate category and filter in memory if dataset is small, or do a lookup.
      // For simplicity and performance, let's assume we pass category ID or handle slug lookup.
      // Actually, the requirement says "filter via slug/name in UI", but API usually takes ID.
      // Let's support filtering by category ID directly if passed, or if slug is passed, look it up.
      // But for now, let's just return all and filter in frontend for admin,
      // and for client side we might need a more robust query.
      // Let's implement slug lookup.
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        query = { category: category._id };
      }
    }

    const products = await Product.find(query).populate('category').sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
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
    // Basic validation
    if (!body.name || !body.category || !body.images || body.images.length === 0 || !body.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
