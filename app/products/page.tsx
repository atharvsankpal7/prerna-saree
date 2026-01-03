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
    price: number;
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
        <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-white">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <span className="text-pink-600 font-body text-sm font-bold tracking-widest uppercase mb-3 block">
                        Our Collection
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#93316a] mb-6">
                        Discover Your Elegance
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto" />
                </div>

                {/* Categories Tabs */}
                <div className="mb-12 overflow-x-auto pb-4 flex justify-center">
                    <Tabs value={categoryParam} onValueChange={handleTabChange} className="w-full max-w-4xl">
                        <TabsList className="inline-flex h-auto p-1 bg-white/50 backdrop-blur-sm border border-pink-100 rounded-full shadow-sm mx-auto">
                            <TabsTrigger
                                value="all"
                                className="px-6 py-2.5 rounded-full font-body text-sm font-medium data-[state=active]:bg-[#93316a] data-[state=active]:text-white transition-all"
                            >
                                All
                            </TabsTrigger>
                            {categories.map((cat) => (
                                <TabsTrigger
                                    key={cat._id}
                                    value={cat.slug}
                                    className="px-6 py-2.5 rounded-full font-body text-sm font-medium data-[state=active]:bg-[#93316a] data-[state=active]:text-white transition-all whitespace-nowrap"
                                >
                                    {cat.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <Link key={product._id} href={`/product/${product._id}`}>
                                <div className="group h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50">
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-heading font-bold text-lg text-gray-800 truncate group-hover:text-[#93316a] transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-pink-500 font-medium mt-1 mb-2 font-body">
                                            {product.category?.name}
                                        </p>
                                        <p className="text-lg font-bold text-gray-900 mb-1">₹{product.price}</p>
                                        {product.specs?.color && (
                                            <p className="text-xs text-gray-500 font-body">
                                                Color: {product.specs.color}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-xl text-gray-500 font-heading italic">No products found in this category.</p>
                        </div>
                    )}
                </div>
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
