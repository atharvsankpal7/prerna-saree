'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Image as ImageIcon, X, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CldUploadWidget } from 'next-cloudinary';
import { Loader } from '@/components/ui/loader';

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    category: Category;
    images: string[];
    price: number;
    specs: {
        color: string;
        fabric: string;
        design: string;
    };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { toast } = useToast();

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [specs, setSpecs] = useState({
        color: '',
        fabric: '',
        design: '',
    });

    useEffect(() => {
        const init = async () => {
            setFetching(true);
            await Promise.all([fetchProducts(), fetchCategories()]);
            setFetching(false);
        };
        init();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data || []);
            } else {
                console.error('Received non-array data for products:', data);
                setProducts([]);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to load products' });
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch products' });
        }
    };

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
    };

    const handleEdit = (product: Product) => {
        setEditingId(product._id);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setCategoryId(product.category._id);
        setImages(product.images);
        setSpecs(product.specs || { color: '', fabric: '', design: '' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setName('');
        setDescription('');
        setPrice('');
        setCategoryId('');
        setImages([]);
        setSpecs({ color: '', fabric: '', design: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !categoryId || images.length === 0 || !price) {
            toast({ variant: 'destructive', title: 'Error', description: 'Name, Category, Price, and at least one Image are required' });
            return;
        }

        setLoading(true);
        try {
            const url = editingId ? `/api/products/${editingId}` : '/api/products';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    price: parseFloat(price),
                    category: categoryId,
                    images,
                    specs,
                }),
            });

            if (res.ok) {
                toast({ title: 'Success', description: `Product ${editingId ? 'updated' : 'created'}` });
                handleCancelEdit();
                fetchProducts();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: `Failed to ${editingId ? 'update' : 'create'} product` });
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
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast({ title: 'Success', description: 'Product deleted' });
                fetchProducts();
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete product' });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Product Management</h1>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Create/Edit Product Form */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
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
                                <Label>Price (INR)</Label>
                                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 1299" />
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
                                            setImages((prev) => [...prev, result.info.secure_url]);
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
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? <Loader className="mr-2" size={16} /> : null}
                                    {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Product' : 'Create Product')}
                                </Button>
                                {editingId && (
                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Products List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {fetching ? (
                            <div className="flex justify-center p-8">
                                <Loader />
                            </div>
                        ) : (
                            <div className="max-h-[800px] overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
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
                                                <TableCell>₹{product.price}</TableCell>
                                                <TableCell>{product.category?.name || 'Unknown'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-blue-500 hover:text-blue-600"
                                                            onClick={() => handleEdit(product)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-600"
                                                            onClick={() => handleDelete(product._id)}
                                                            disabled={deletingId === product._id}
                                                        >
                                                            {deletingId === product._id ? <Loader size={16} /> : <Trash2 className="w-4 h-4" />}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {products.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                    No products found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
