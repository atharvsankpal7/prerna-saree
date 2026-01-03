'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CldUploadWidget } from 'next-cloudinary';
import { Loader } from '@/components/ui/loader';

interface Category {
    _id: string;
    name: string;
    image: string;
    slug: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setFetching(true);
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !image) {
            toast({ variant: 'destructive', title: 'Error', description: 'Name and Image are required' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image }),
            });

            if (res.ok) {
                toast({ title: 'Success', description: 'Category created' });
                setName('');
                setImage('');
                fetchCategories();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to create category' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast({ title: 'Success', description: 'Category deleted' });
                fetchCategories();
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete category' });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Category Management</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Category Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Category Name</Label>
                                <Input
                                    placeholder="e.g. Silk Sarees"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cover Image</Label>
                                <div className="flex items-center gap-4">
                                    {image && (
                                        <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                                    )}
                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "prerna_preset"}
                                        onSuccess={(result: any) => {
                                            setImage(result.info.secure_url);
                                        }}
                                    >
                                        {({ open }) => (
                                            <Button type="button" variant="outline" onClick={() => open()}>
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Upload Image
                                            </Button>
                                        )}
                                    </CldUploadWidget>
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? <Loader className="mr-2" size={16} /> : null}
                                {loading ? 'Creating...' : 'Create Category'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Categories List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {fetching ? (
                            <div className="flex justify-center p-8">
                                <Loader />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category._id}>
                                            <TableCell>
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-10 h-10 object-cover rounded-md"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDelete(category._id)}
                                                    disabled={deletingId === category._id}
                                                >
                                                    {deletingId === category._id ? <Loader size={16} /> : <Trash2 className="w-4 h-4" />}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {categories.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                No categories found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
