import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import '@/models/Category';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../../auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

const getPublicIdFromUrl = (url: string) => {
    try {
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch (e) {
        console.error('Error extracting publicId:', e);
        return null;
    }
};

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

    // Delete all images associated with the product
    if (product.images && product.images.length > 0) {
        console.log('Deleting images:', product.images);
        
        const deletePromises = product.images.map(async (url: string) => {
            const publicId = getPublicIdFromUrl(url);
            console.log('Extracted publicId:', publicId, 'from URL:', url);
            
            if (publicId) {
                try {
                    const result = await cloudinary.uploader.destroy(publicId);
                    console.log('Cloudinary delete result:', result);
                    return result;
                } catch (error) {
                    console.error('Error deleting from cloudinary:', error);
                    return null;
                }
            }
            return null;
        });
        
        await Promise.all(deletePromises);
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
        console.log('Images to delete:', imagesToDelete);
        
        const deletePromises = imagesToDelete.map(async (url: string) => {
            const publicId = getPublicIdFromUrl(url);
            console.log('Extracted publicId:', publicId, 'from URL:', url);
            
            if (publicId) {
                try {
                    const result = await cloudinary.uploader.destroy(publicId);
                    console.log('Cloudinary delete result:', result);
                    return result;
                } catch (error) {
                    console.error('Error deleting from cloudinary:', error);
                    return null;
                }
            }
            return null;
        });
        
        await Promise.all(deletePromises);
    }

    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}