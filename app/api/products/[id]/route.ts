import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import '@/models/Category';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../../auth/[...nextauth]/route';
import { deleteManyLocalUploadFiles } from '@/lib/local-images';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.images?.length > 0) {
      await deleteManyLocalUploadFiles(product.images);
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { id } = params;
    const body = await req.json();
    
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Identify deleted images
    const newImages = body.images || [];
    const oldImages = existingProduct.images || [];
    
    const imagesToDelete = oldImages.filter((img: string) => !newImages.includes(img));

    if (imagesToDelete.length > 0) {
      await deleteManyLocalUploadFiles(imagesToDelete);
    }

    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
