'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ProductSkeleton from '@/components/skeletons/ProductSkeleton';

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface Product {
    _id: string;
    name: string;
    images: string[];
    category: { name: string };
    specs?: { color?: string };
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryParam = searchParams.get('category') || 'all';

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(categoryParam);
    }, [categoryParam]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const fetchProducts = async (categorySlug: string) => {
        setLoading(true);
        try {
            const url = categorySlug === 'all'
                ? '/api/products'
                : `/api/products?category=${categorySlug}`;

            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            // Simulate a small delay to show skeleton if response is too fast, for UX smoothness
            // setTimeout(() => setLoading(false), 300); 
            setLoading(false);
        }
    };

    const handleTabChange = (value: string) => {
        if (value === 'all') {
            router.push('/products');
        } else {
            router.push(`/products?category=${value}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Our Collection</h1>

            {/* Categories Tabs */}
            <div className="mb-8 overflow-x-auto pb-2">
                <Tabs value={categoryParam} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/20">
                        <TabsTrigger value="all" className="px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            All
                        </TabsTrigger>
                        {categories.map((cat) => (
                            <TabsTrigger
                                key={cat._id}
                                value={cat.slug}
                                className="px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                            >
                                {cat.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    // Show 8 skeletons while loading
                    Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <Link key={product._id} href={`/product/${product._id}`}>
                            <Card className="h-full hover:shadow-lg transition-all duration-300 border-none shadow-sm group">
                                <CardContent className="p-0">
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Optional: Add badges or quick actions here */}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-lg truncate group-hover:text-primary transition-colors">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{product.category?.name}</p>
                                        {product.specs?.color && (
                                            <p className="text-xs text-muted-foreground mt-1">Color: {product.specs.color}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No products found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
