'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';

interface Product {
    _id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    specs: {
        color: string;
        fabric: string;
        design: string;
        border: string;
        blouse: string;
    };
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products?id=${id}`);
            // Note: Our API currently returns all products if no ID is passed in a specific way, 
            // or we need a specific endpoint. 
            // Actually, we defined /api/products/[id] for DELETE, but usually GET /api/products/[id] is better.
            // But let's check our API implementation.
            // We implemented GET /api/products which takes query params.
            // We implemented DELETE /api/products/[id].
            // We did NOT implement GET /api/products/[id].
            // I should probably implement GET /api/products/[id] or just filter in the client if the list is small (not ideal).
            // Or I can fetch from /api/products and find the one.
            // Better: Update the API to handle GET /api/products/[id].
            // For now, let's assume I'll fix the API or use a query param on the main route if I modify it.
            // Let's try fetching all and finding for now to save a step, or better, fix the API.
            // Actually, I can just add a GET handler to app/api/products/[id]/route.ts.

            // Let's assume I will add the GET handler.
            const response = await fetch(`/api/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch product', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrder = () => {
        if (!product) return;
        const message = `Hi, I'm interested in ${product.name}: ${window.location.href}`;
        const waLink = `https://wa.me/919104391918?text=${encodeURIComponent(message)}`;
        window.open(waLink, '_blank');
    };

    if (loading) return <ProductDetailSkeleton />;
    if (!product) return <div className="text-center py-20 font-heading text-xl">Product not found</div>;

    return (
        <div className="min-h-screen bg-[#FFF0F5] py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Left: Image Gallery */}
                        <div className="p-6 md:p-8 bg-gray-50">
                            <div className="flex gap-4 h-[500px] md:h-[600px]">
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-3 w-20 overflow-y-auto no-scrollbar py-1">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300 ${selectedImage === img ? 'ring-2 ring-[#93316a] ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm">
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-8">
                                <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 mb-4 px-3 py-1 text-xs font-body tracking-wider uppercase">
                                    Premium Collection
                                </Badge>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#2b0c1c] mb-6 leading-tight">
                                    {product.name}
                                </h1>
                                <p className="text-gray-600 leading-relaxed font-body text-lg">
                                    {product.description}
                                </p>
                            </div>

                            <div className="space-y-6 mb-8 bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
                                <h3 className="font-heading font-bold text-xl text-[#93316a]">Product Specifications</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm font-body text-gray-700">
                                    {product.specs.color && <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#93316a]"></span><span className="font-semibold text-gray-900">Color:</span> {product.specs.color}</li>}
                                    {product.specs.fabric && <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#93316a]"></span><span className="font-semibold text-gray-900">Fabric:</span> {product.specs.fabric}</li>}
                                    {product.specs.design && <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#93316a]"></span><span className="font-semibold text-gray-900">Design:</span> {product.specs.design}</li>}
                                    {product.specs.border && <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#93316a]"></span><span className="font-semibold text-gray-900">Border:</span> {product.specs.border}</li>}
                                    {product.specs.blouse && <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#93316a]"></span><span className="font-semibold text-gray-900">Blouse:</span> {product.specs.blouse}</li>}
                                </ul>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-3xl md:text-4xl font-heading font-bold text-[#93316a]">₹{product.price}</span>
                                    <Badge variant="destructive" className="text-sm px-3 py-1 rounded-full">20% OFF</Badge>
                                </div>

                                <Button
                                    onClick={handleOrder}
                                    className="w-full h-16 text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 font-body tracking-wide"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    Order via WhatsApp
                                </Button>
                                <p className="text-center text-xs text-gray-400 mt-3 font-body">
                                    Secure checkout via WhatsApp Business
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-2xl">🚚</div>
                            <div>
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Free Shipping</p>
                                <p className="text-[10px] text-gray-500">On all prepaid orders</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-2xl">⭐</div>
                            <div>
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Assured Quality</p>
                                <p className="text-[10px] text-gray-500">Handpicked collection</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-2xl">💳</div>
                            <div>
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Secure Payment</p>
                                <p className="text-[10px] text-gray-500">100% secure transaction</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-2xl">💎</div>
                            <div>
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Best Price</p>
                                <p className="text-[10px] text-gray-500">Guaranteed value</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
