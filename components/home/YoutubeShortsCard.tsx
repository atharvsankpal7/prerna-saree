'use client';

import { useState } from 'react';
import Image from 'next/image';

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
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // YouTube thumbnail URL - using maxresdefault for highest quality
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    // Fallback to hqdefault if maxresdefault doesn't exist
    const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const handleClick = () => {
        setIsLoading(true);
        setIsPlaying(true);
    };

    return (
        <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-gray-900">
            {!isPlaying ? (
                // Thumbnail with play button overlay
                <button
                    onClick={handleClick}
                    className="absolute inset-0 w-full h-full group cursor-pointer"
                    aria-label="Play video"
                >
                    {/* Thumbnail Image */}
                    <Image
                        src={thumbnailUrl}
                        alt="Video thumbnail"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback to lower quality thumbnail if maxresdefault doesn't exist
                            const target = e.target as HTMLImageElement;
                            if (target.src !== fallbackThumbnailUrl) {
                                target.src = fallbackThumbnailUrl;
                            }
                        }}
                    />

                    {/* Gradient overlay for better play button visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 md:w-8 md:h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500">
                            <svg
                                className="w-5 h-5 md:w-6 md:h-6 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </button>
            ) : (
                // YouTube iframe with autoplay
                <>
                    {/* Loading spinner while iframe loads */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                            <Image
                                src={thumbnailUrl}
                                alt="Video thumbnail"
                                fill
                                className="object-cover opacity-50"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== fallbackThumbnailUrl) {
                                        target.src = fallbackThumbnailUrl;
                                    }
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-white/20 border-t-red-500 rounded-full animate-spin" />
                            </div>
                        </div>
                    )}
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                    />
                </>
            )}
        </div>
    );
}
