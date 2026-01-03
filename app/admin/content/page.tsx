'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CldUploadWidget } from 'next-cloudinary';

export default function ContentPage() {
    const [heroImages, setHeroImages] = useState<string[]>([]);
    const [influencerVideos, setInfluencerVideos] = useState<any[]>([]);
    const [dispatchVideos, setDispatchVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Influencer Form
    const [infUrl, setInfUrl] = useState('');
    const [infName, setInfName] = useState('');
    const [infReview, setInfReview] = useState('');

    // Dispatch Form
    const [dispUrl, setDispUrl] = useState('');

    useEffect(() => {
        fetchHeroImages();
        fetchVideos();
    }, []);

    const fetchHeroImages = async () => {
        const res = await fetch('/api/content/hero');
        const data = await res.json();
        setHeroImages(data);
    };

    const fetchVideos = async () => {
        const res = await fetch('/api/content/videos');
        const data = await res.json();
        setInfluencerVideos(data.influencerVideos);
        setDispatchVideos(data.dispatchVideos);
    };

    const handleHeroSave = async () => {
        setLoading(true);
        try {
            await fetch('/api/content/hero', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: heroImages }),
            });
            toast({ title: 'Success', description: 'Hero images updated' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update hero images' });
        } finally {
            setLoading(false);
        }
    };

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleAddInfluencer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!infUrl || !infName) return;

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

        try {
            await fetch('/api/content/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'dispatch',
                    video: { url: dispUrl, thumbnail },
                }),
            });
            toast({ title: 'Success', description: 'Dispatch video added' });
            setDispUrl('');
            fetchVideos();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to add video' });
        }
    };

    const handleDeleteVideo = async (id: string, type: 'influencer' | 'dispatch') => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/content/videos?id=${id}&type=${type}`, { method: 'DELETE' });
            toast({ title: 'Success', description: 'Video deleted' });
            fetchVideos();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete video' });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Content Management</h1>

            <Tabs defaultValue="hero">
                <TabsList>
                    <TabsTrigger value="hero">Hero Carousel</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Images (Max 5)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                {heroImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img} alt="Hero" className="w-40 h-24 object-cover rounded-md border" />
                                        <button
                                            onClick={() => setHeroImages(heroImages.filter((_, i) => i !== idx))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {heroImages.length < 5 && (
                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "prerna_preset"}
                                        onSuccess={(result: any) => {
                                            setHeroImages([...heroImages, result.info.secure_url]);
                                        }}
                                    >
                                        {({ open }) => (
                                            <Button variant="outline" className="h-24 w-40" onClick={() => open()}>
                                                <Plus className="w-6 h-6 mr-2" />
                                                Add Image
                                            </Button>
                                        )}
                                    </CldUploadWidget>
                                )}
                            </div>
                            <Button onClick={handleHeroSave} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="videos" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Influencer Videos */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Influencer Feedback</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleAddInfluencer} className="space-y-3">
                                    <Input placeholder="Video URL (Reel/YT)" value={infUrl} onChange={(e) => setInfUrl(e.target.value)} />
                                    <Input placeholder="Creator Name" value={infName} onChange={(e) => setInfName(e.target.value)} />
                                    <Input placeholder="Review Summary" value={infReview} onChange={(e) => setInfReview(e.target.value)} />
                                    <Button type="submit" size="sm">Add Influencer Video</Button>
                                </form>
                                <div className="space-y-2 max-h-60 overflow-auto">
                                    {influencerVideos.map((vid) => (
                                        <div key={vid._id} className="flex items-center justify-between p-2 border rounded">
                                            <div className="truncate flex-1 mr-2">
                                                <p className="font-medium text-sm">{vid.creatorName}</p>
                                                <p className="text-xs text-muted-foreground truncate">{vid.url}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteVideo(vid._id, 'influencer')}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dispatch Magic */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dispatch Magic</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleAddDispatch} className="space-y-3">
                                    <Input placeholder="YouTube URL" value={dispUrl} onChange={(e) => setDispUrl(e.target.value)} />
                                    <Button type="submit" size="sm">Add Dispatch Video</Button>
                                </form>
                                <div className="space-y-2 max-h-60 overflow-auto">
                                    {dispatchVideos.map((vid) => (
                                        <div key={vid._id} className="flex items-center justify-between p-2 border rounded">
                                            <div className="flex items-center gap-2 flex-1 mr-2">
                                                <img src={vid.thumbnail} alt="Thumb" className="w-12 h-8 object-cover rounded" />
                                                <p className="text-xs text-muted-foreground truncate flex-1">{vid.url}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteVideo(vid._id, 'dispatch')}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
