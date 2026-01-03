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
        const waLink = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`; // Replace with actual number
        window.open(waLink, '_blank');
    };

    if (loading) return <ProductDetailSkeleton />;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 bg-[#FFF0F5] min-h-screen">
            {/* Using a light pink background similar to the reference image */}

            <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm">
                {/* Left: Image Gallery */}
                <div className="flex gap-4 h-[600px]">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-4 w-20 overflow-y-auto no-scrollbar">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`border-2 rounded-md overflow-hidden transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-24 object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 relative overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="space-y-6 py-4">
                    <div>
                        <h1 className="text-3xl font-serif text-gray-800 mb-4">{product.name}</h1>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Product Specifications</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            {product.specs.color && <li><span className="font-semibold">Color:</span> {product.specs.color}</li>}
                            {product.specs.fabric && <li><span className="font-semibold">Fabric:</span> {product.specs.fabric}</li>}
                            {product.specs.design && <li><span className="font-semibold">Design:</span> {product.specs.design}</li>}
                            {product.specs.border && <li><span className="font-semibold">Border:</span> {product.specs.border}</li>}
                            {product.specs.blouse && <li><span className="font-semibold">Blouse:</span> {product.specs.blouse}</li>}
                        </ul>
                    </div>

                    <div className="pt-4">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold">RS. 1299</span> {/* Placeholder Price */}
                            <Badge variant="destructive" className="text-sm px-2 py-1">20% OFF</Badge>
                        </div>

                        <Button
                            onClick={handleOrder}
                            className="w-full h-14 text-lg font-medium bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-transform hover:scale-[1.02]"
                        >
                            <MessageCircle className="w-6 h-6 mr-2" />
                            Order Now
                        </Button>
                    </div>

                    {/* Trust Badges (Static for now as per image) */}
                    <div className="grid grid-cols-4 gap-4 pt-8 border-t mt-8">
                        <div className="text-center">
                            <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">🚚</div>
                            <p className="text-[10px] font-bold text-amber-900">FREE SHIPPING</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">⭐</div>
                            <p className="text-[10px] font-bold text-amber-900">ASSURED QUALITY</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">💳</div>
                            <p className="text-[10px] font-bold text-amber-900">SECURE PAYMENT</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">₹</div>
                            <p className="text-[10px] font-bold text-amber-900">BEST PRICE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
