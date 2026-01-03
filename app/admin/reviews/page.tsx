'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Review {
    _id: string;
    productId: { _id: string; name: string } | null;
    rating: number;
    userName: string;
    comment: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        setReviews(data);
    };

    const handleStatusChange = async (id: string, isApproved: boolean) => {
        try {
            const res = await fetch('/api/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isApproved }),
            });

            if (res.ok) {
                toast({ title: 'Success', description: `Review ${isApproved ? 'approved' : 'rejected'}` });
                fetchReviews();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong' });
        }
    };

    const handleFeaturedChange = async (id: string, isFeatured: boolean) => {
        try {
            const res = await fetch('/api/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isFeatured }),
            });

            if (res.ok) {
                toast({ title: 'Success', description: `Review ${isFeatured ? 'featured' : 'unfeatured'}` });
                fetchReviews();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to update featured status' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong' });
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Rating</TableHead>
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
                                            className={review.isFeatured ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                                        >
                                            <Star className={`w-4 h-4 ${review.isFeatured ? 'fill-white' : ''}`} />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {!review.isApproved && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                onClick={() => handleStatusChange(review._id, true)}
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {review.isApproved && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleStatusChange(review._id, false)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {reviews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No reviews found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
