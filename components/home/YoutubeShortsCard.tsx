'use client';

import { useState } from 'react';
import { Play, Pause, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface YoutubeShortsCardProps {
    videoId: string;
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
    creatorName?: string;
    reviewSummary?: string;
}

// Helper function to extract YouTube video ID from various URL formats
export function extractYoutubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    return null;
}

export default function YoutubeShortsCard({
    videoId,
    isPlaying,
    onPlay,
    onPause,
    creatorName,
    reviewSummary,
}: YoutubeShortsCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

    const handleClick = () => {
        if (isPlaying) {
            onPause();
        } else {
            onPlay();
        }
    };

    const openInYoutube = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://www.youtube.com/shorts/${videoId}`, '_blank');
    };

    return (
        <motion.div
            className="relative flex-shrink-0 w-[200px] sm:w-[220px] md:w-full snap-center group cursor-pointer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            {/* Card Container with 9:16 aspect ratio */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 shadow-lg hover:shadow-2xl transition-all duration-300"
                style={{ aspectRatio: '9/16' }}
            >
                {/* Thumbnail or Video */}
                {!isPlaying ? (
                    <>
                        {/* Thumbnail */}
                        <img
                            src={thumbnailUrl}
                            alt={creatorName || 'YouTube Short'}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Play className="w-8 h-8 text-[#93316a] ml-1" fill="#93316a" />
                            </motion.div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* YouTube Embed - Simple approach like the reference */}
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 'none' }}
                        />

                        {/* Control Overlay - visible on hover */}
                        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            {/* Pause indicator */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                                >
                                    <Pause className="w-7 h-7 text-white" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Open in YouTube Button */}
                        <div className="absolute bottom-4 right-4 z-10">
                            <motion.button
                                onClick={openInYoutube}
                                className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ExternalLink className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </>
                )}

                {/* Creator Info Overlay */}
                {creatorName && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <p className="text-white font-semibold text-sm truncate drop-shadow-lg">
                            {creatorName}
                        </p>
                        {reviewSummary && !isPlaying && (
                            <p className="text-white/80 text-xs mt-1 line-clamp-2 drop-shadow-md">
                                {reviewSummary}
                            </p>
                        )}
                    </div>
                )}

                {/* Decorative border glow on hover */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-[#93316a]/30 transition-all duration-300" />
            </div>
        </motion.div>
    );
}
