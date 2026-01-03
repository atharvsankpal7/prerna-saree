'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CldUploadWidget } from 'next-cloudinary';

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    category: Category;
    images: string[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [specs, setSpecs] = useState({
        color: '',
        fabric: '',
        design: '',
        border: '',
        blouse: '',
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
    };

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !categoryId || images.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Name, Category, and at least one Image are required' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    category: categoryId,
                    images,
                    specs,
                }),
            });

            if (res.ok) {
                toast({ title: 'Success', description: 'Product created' });
                // Reset form
                setName('');
                setDescription('');
                setCategoryId('');
                setImages([]);
                setSpecs({ color: '', fabric: '', design: '', border: '', blouse: '' });
                fetchProducts();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to create product' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast({ title: 'Success', description: 'Product deleted' });
                fetchProducts();
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete product' });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Product Management</h1>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Create Product Form */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Add New Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Product Name</Label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Navy Blue Silk Saree" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." />
                            </div>

                            <div className="space-y-2">
                                <Label>Images (First is primary)</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                            <img src={img} alt="Product" className="w-20 h-20 object-cover rounded-md border" />
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "prerna_preset"}
                                        onSuccess={(result: any) => {
                                            setImages([...images, result.info.secure_url]);
                                        }}
                                    >
                                        {({ open }) => (
                                            <Button type="button" variant="outline" className="h-20 w-20" onClick={() => open()}>
                                                <Plus className="w-6 h-6 text-muted-foreground" />
                                            </Button>
                                        )}
                                    </CldUploadWidget>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Specifications</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Color" value={specs.color} onChange={(e) => setSpecs({ ...specs, color: e.target.value })} />
                                    <Input placeholder="Fabric" value={specs.fabric} onChange={(e) => setSpecs({ ...specs, fabric: e.target.value })} />
                                    <Input placeholder="Design" value={specs.design} onChange={(e) => setSpecs({ ...specs, design: e.target.value })} />
                                    <Input placeholder="Border" value={specs.border} onChange={(e) => setSpecs({ ...specs, border: e.target.value })} />
                                    <Input placeholder="Blouse" value={specs.blouse} onChange={(e) => setSpecs({ ...specs, blouse: e.target.value })} />
                                </div>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Creating...' : 'Create Product'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Products List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[800px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product._id}>
                                            <TableCell>
                                                {product.images[0] && (
                                                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.category?.name || 'Unknown'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {products.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
