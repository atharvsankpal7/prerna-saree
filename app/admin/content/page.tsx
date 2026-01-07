'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/ui/loader';

export default function ContentPage() {
    const [influencerVideos, setInfluencerVideos] = useState<any[]>([]);
    const [dispatchVideos, setDispatchVideos] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [addingVideo, setAddingVideo] = useState<'influencer' | 'dispatch' | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { toast } = useToast();

    // Influencer Form
    const [infUrl, setInfUrl] = useState('');
    const [infName, setInfName] = useState('');
    const [infReview, setInfReview] = useState('');

    // Dispatch Form
    const [dispUrl, setDispUrl] = useState('');

    useEffect(() => {
        const init = async () => {
            setFetching(true);
            await fetchVideos();
            setFetching(false);
        };
        init();
    }, []);

    const fetchVideos = async () => {
        const res = await fetch('/api/content/videos');
        const data = await res.json();
        setInfluencerVideos(data.influencerVideos);
        setDispatchVideos(data.dispatchVideos);
    };

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleAddInfluencer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!infUrl || !infName) return;

        const videoId = getYoutubeId(infUrl);
        if (!videoId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter a valid YouTube URL' });
            return;
        }

        setAddingVideo('influencer');
        try {
            await fetch('/api/content/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'influencer',
                    video: { url: infUrl, creatorName: infName, reviewSummary: infReview },
                }),
            });
            toast({ title: 'Success', description: 'Influencer video added' });
            setInfUrl(''); setInfName(''); setInfReview('');
            fetchVideos();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to add video' });
        } finally {
            setAddingVideo(null);
        }
    };

    const handleAddDispatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dispUrl) return;

        const videoId = getYoutubeId(dispUrl);
        if (!videoId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Invalid YouTube URL' });
            return;
        }
        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        setAddingVideo('dispatch');
        try {
            await fetch('/api/content/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'dispatch',
                    video: { url: dispUrl, thumbnail },
                }),
            });
            toast({ title: 'Success', description: 'Prerna Magic video added' });
            setDispUrl('');
            fetchVideos();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to add video' });
        } finally {
            setAddingVideo(null);
        }
    };

    const handleDeleteVideo = async (id: string, type: 'influencer' | 'dispatch') => {
        if (!confirm('Are you sure?')) return;
        setDeletingId(id);
        try {
            await fetch(`/api/content/videos?id=${id}&type=${type}`, { method: 'DELETE' });
            toast({ title: 'Success', description: 'Video deleted' });
            fetchVideos();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete video' });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Content Management</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Influencer Videos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Influencer Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleAddInfluencer} className="space-y-3">
                            <Input placeholder="YouTube URL" value={infUrl} onChange={(e) => setInfUrl(e.target.value)} />
                            <Input placeholder="Creator Name" value={infName} onChange={(e) => setInfName(e.target.value)} />
                            <Input placeholder="Review Summary" value={infReview} onChange={(e) => setInfReview(e.target.value)} />
                            <Button type="submit" size="sm" disabled={addingVideo === 'influencer'}>
                                {addingVideo === 'influencer' ? <Loader className="mr-2" size={16} /> : null}
                                Add Influencer Video
                            </Button>
                        </form>
                        {fetching ? (
                            <div className="flex justify-center p-4">
                                <Loader />
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-auto">
                                {influencerVideos.map((vid) => (
                                    <div key={vid._id} className="flex items-center justify-between p-2 border rounded">
                                        <div className="truncate flex-1 mr-2">
                                            <p className="font-medium text-sm">{vid.creatorName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{vid.url}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => handleDeleteVideo(vid._id, 'influencer')}
                                            disabled={deletingId === vid._id}
                                        >
                                            {deletingId === vid._id ? <Loader size={16} /> : <Trash2 className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Prerna Magic */}
                <Card>
                    <CardHeader>
                        <CardTitle>Prerna Magic</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleAddDispatch} className="space-y-3">
                            <Input placeholder="YouTube URL" value={dispUrl} onChange={(e) => setDispUrl(e.target.value)} />
                            <Button type="submit" size="sm" disabled={addingVideo === 'dispatch'}>
                                {addingVideo === 'dispatch' ? <Loader className="mr-2" size={16} /> : null}
                                Add Prerna Magic Video
                            </Button>
                        </form>
                        {fetching ? (
                            <div className="flex justify-center p-4">
                                <Loader />
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-auto">
                                {dispatchVideos.map((vid) => (
                                    <div key={vid._id} className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center gap-2 flex-1 mr-2">
                                            <img src={vid.thumbnail} alt="Thumb" className="w-12 h-8 object-cover rounded" />
                                            <p className="text-xs text-muted-foreground truncate flex-1">{vid.url}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => handleDeleteVideo(vid._id, 'dispatch')}
                                            disabled={deletingId === vid._id}
                                        >
                                            {deletingId === vid._id ? <Loader size={16} /> : <Trash2 className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
