export const runtime = 'nodejs';

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
