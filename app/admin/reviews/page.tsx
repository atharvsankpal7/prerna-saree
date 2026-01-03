'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';

interface Review {
    _id: string;
    productId: { _id: string; name: string } | null;
    rating: number;
    userName: string;
    comment: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: string;
    images: string[];
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [fetching, setFetching] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setFetching(true);
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json();
            if (Array.isArray(data)) {
                setReviews(data);
            } else {
                console.error('Received non-array data:', data);
                setReviews([]);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to load reviews' });
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch reviews' });
        } finally {
            setFetching(false);
        }
    };

    const handleStatusChange = async (id: string, isApproved: boolean) => {
        setUpdatingId(id);
        try {
            const res = await fetch('/api/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isApproved }),
            });

            if (res.ok) {
                toast({ title: 'Success', description: `Review ${isApproved ? 'approved' : 'rejected'}` });
                // Optimistic update or refetch
                setReviews(reviews.map(r => r._id === id ? { ...r, isApproved } : r));
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleFeaturedChange = async (id: string, isFeatured: boolean) => {
        setUpdatingId(id);
        try {
            const res = await fetch('/api/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isFeatured }),
            });

            if (res.ok) {
                toast({ title: 'Success', description: `Review ${isFeatured ? 'featured' : 'unfeatured'}` });
                setReviews(reviews.map(r => r._id === id ? { ...r, isFeatured } : r));
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to update featured status' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast({ title: 'Success', description: 'Review deleted' });
                setReviews(reviews.filter((r) => r._id !== id));
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete review' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong' });
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Review Moderation</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Reviews</CardTitle>
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
                                    <TableHead>Product</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Images</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.map((review) => (
                                    <TableRow key={review._id}>
                                        <TableCell className="font-medium">{review.productId?.name || 'Deleted Product'}</TableCell>
                                        <TableCell>{review.userName}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {review.rating} <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {review.images && review.images.length > 0 ? (
                                                    review.images.map((img, idx) => (
                                                        <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                                                            <img src={img} alt="Review" className="w-10 h-10 object-cover rounded border" />
                                                        </a>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">No images</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate" title={review.comment}>
                                            {review.comment}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={review.isApproved ? 'default' : 'secondary'}>
                                                {review.isApproved ? 'Approved' : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant={review.isFeatured ? 'default' : 'outline'}
                                                onClick={() => handleFeaturedChange(review._id, !review.isFeatured)}
                                                disabled={updatingId === review._id}
                                                className={review.isFeatured ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                                            >
                                                {updatingId === review._id ? <Loader size={14} className="text-current" /> : <Star className={`w-4 h-4 ${review.isFeatured ? 'fill-white' : ''}`} />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {!review.isApproved && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleStatusChange(review._id, true)}
                                                    disabled={updatingId === review._id}
                                                >
                                                    {updatingId === review._id ? <Loader size={14} /> : <Check className="w-4 h-4" />}
                                                </Button>
                                            )}
                                            {review.isApproved && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleStatusChange(review._id, false)}
                                                    disabled={updatingId === review._id}
                                                >
                                                    {updatingId === review._id ? <Loader size={14} /> : <X className="w-4 h-4" />}
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(review._id)}
                                                disabled={updatingId === review._id}
                                            >
                                                {updatingId === review._id ? <Loader size={14} /> : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {reviews.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            No reviews found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
