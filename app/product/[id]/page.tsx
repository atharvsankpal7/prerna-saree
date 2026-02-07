'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Star, X, MoveLeft, AlertCircle, RefreshCcw } from 'lucide-react';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';
import { useRouter } from 'next/navigation';
import LocalImageUploader from '@/components/admin/LocalImageUploader';

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
    };
    category: {
        _id: string;
        name: string;
        slug: string;
    };
}

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    images?: string[];
    createdAt: string;
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '', images: [] as string[] });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProduct();
            fetchReviews();
        }
    }, [id]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${id}&public=true`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newReview, productId: id }),
            });

            if (res.ok) {
                alert('Review submitted successfully! It will be visible after approval.');
                setNewReview({ userName: '', rating: 5, comment: '', images: [] });
            } else {
                alert('Failed to submit review.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Something went wrong.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const fetchProduct = async () => {
        try {
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
        <div className="min-h-screen bg-[#FFF0F5] pb-12 pt-4 px-4 md:px-8">
            <div className="max-w-7xl mx-auto  mb-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/products?category=${product.category.slug}`)}
                    className="group flex items-center gap-3 text-[#93316a] bg-white transition-all duration-300 rounded-full pl-2 pr-6"
                >
                    <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow transition-all">
                        <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                    <span className="font-bold text-sm">Back to {product.category.name}</span>
                </Button>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Left: Image Gallery */}
                        <div className="p-4 md:p-8 bg-gray-50">
                            <div className="flex flex-col gap-6">
                                {/* Main Image */}
                                <div className="relative rounded-2xl overflow-hidden shadow-sm w-full bg-white min-h-[400px] md:min-h-[500px] flex items-center justify-center">
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain max-h-[600px]"
                                    />
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative aspect-[3/4] w-full rounded-lg overflow-hidden transition-all duration-300 ${selectedImage === img ? 'ring-2 ring-[#93316a] ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="py-1 px-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-8">
                                <div className="flex items-baseline gap-2 mb-5">
                                    <span className="text-3xl md:text-4xl font-heading font-bold text-[#93316a]">₹{product.price}</span>
                                    <span className="text-sm font-medium text-blue-900">+ Shipping Charges</span>
                                </div>
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
                                </ul>
                            </div>

                            {/* Return & Exchange Policy */}
                            <div className="grid grid-cols-1 gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-gray-900 text-sm block">No Return Or Refund</span>
                                        <p className="text-xs text-gray-500 mt-0.5">Please review the product details carefully before purchasing.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <RefreshCcw className="w-5 h-5 text-[#93316a] shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-gray-900 text-sm block">Exchange Policy</span>
                                        <p className="text-xs text-gray-500 mt-0.5">Exchange available only in case of damage or defective product received.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">


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

                    {/* Reviews Section */}
                    <div className="p-8 md:p-12 bg-white border-t border-gray-100">
                        <h2 className="text-3xl font-heading font-bold text-[#2b0c1c] mb-8">Customer Reviews</h2>

                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-gray-900">{review.userName}</h4>
                                                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex text-yellow-400 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2 overflow-x-auto pb-2">
                                                    {review.images.map((img, idx) => (
                                                        <img key={idx} src={img} alt={`Review ${idx}`} className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Review Form */}
                            <div className="bg-pink-50/30 p-6 rounded-2xl border border-pink-100 h-fit">
                                <h3 className="text-xl font-heading font-bold text-[#93316a] mb-4">Write a Review</h3>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                                            value={newReview.userName}
                                            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    className={`focus:outline-none transition-transform hover:scale-110 ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                >
                                                    <Star className={`w-6 h-6 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos</label>
                                        <LocalImageUploader
                                            folder="reviews"
                                            value={newReview.images}
                                            onChange={(images) => setNewReview((prev) => ({ ...prev, images }))}
                                            multiple
                                            maxFiles={5}
                                            disabled={submittingReview}
                                            buttonLabel="Upload Review Photo"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="w-full bg-[#93316a] hover:bg-[#7a2858] text-white"
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
