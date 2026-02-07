import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../../auth/[...nextauth]/route';
import { deleteLocalUploadFile } from '@/lib/local-images';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const { id } = params;
        const { name, image } = await req.json();

        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (category.image !== image) {
            await deleteLocalUploadFile(category.image);
        }

        category.name = name;
        category.image = image;
        await category.save();

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
    const category = await Category.findById(id);
    
    if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await deleteLocalUploadFile(category.image);

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
