import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface VideoSectionProps {
    title: string;
    videos: any[];
    type: 'influencer' | 'dispatch';
}

export default function VideoSection({ title, videos, type }: VideoSectionProps) {
    if (!videos || videos.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <Card key={video._id} className="overflow-hidden border-none shadow-md">
                        <CardContent className="p-0">
                            {type === 'dispatch' ? (
                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-video group">
                                    <img src={video.thumbnail} alt="Video Thumbnail" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                                            <Play className="w-6 h-6 text-primary fill-primary" />
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                <div className="aspect-[9/16] relative bg-black">
                                    {/* For Reels, we might want to embed or just link. 
                      Embedding reels can be tricky without an API. 
                      For now, let's use an iframe if it's embeddable or a link card.
                      Assuming simple link card for now as requested "Reel links".
                  */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center bg-gradient-to-b from-transparent to-black/80">
                                        <p className="font-bold text-lg mb-2">{video.creatorName}</p>
                                        <p className="text-sm mb-4 line-clamp-3">"{video.reviewSummary}"</p>
                                        <a
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            Watch Review
                                        </a>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
