'use client';

interface YoutubeShortsCardProps {
    videoId: string;
}

export function extractYoutubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export default function YoutubeShortsCard({ videoId }: YoutubeShortsCardProps) {
    return (
        <div className="relative w-full aspect-[9/16]">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}
