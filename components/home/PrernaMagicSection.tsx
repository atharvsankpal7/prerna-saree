'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { IM_Fell_English } from 'next/font/google';
import YoutubeShortsCard, { extractYoutubeVideoId } from './YoutubeShortsCard';

const imFellEnglish = IM_Fell_English({ subsets: ['latin'], weight: '400' });

interface DispatchVideo {
    _id: string;
    url: string;
    thumbnail?: string;
}

interface DispatchMagicSectionProps {
    videos: DispatchVideo[];
}

export default function DispatchMagicSection({ videos }: DispatchMagicSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    // Track which video is currently playing (null means no video is playing)
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

    const displayVideos = videos.length > 0 ? videos : [
        {
            _id: '1',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
        },
        {
            _id: '2',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
        },
        {
            _id: '3',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
        }
    ];

    const handlePlay = (videoId: string) => {
        // Set the currently playing video - this automatically pauses others
        setCurrentlyPlayingId(videoId);
    };

    const handlePause = () => {
        // Stop all videos
        setCurrentlyPlayingId(null);
    };

    return (
        <section id="dispatch-magic" ref={containerRef} className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className={`text-4xl sm:text-5xl md:text-7xl ${imFellEnglish.className} font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#93316a] via-pink-600 to-[#93316a] mb-4 md:mb-6 pb-2 drop-shadow-sm`}
                    >
                        Prerna Magic
                    </motion.h2>
                </div>

                <div className="flex overflow-x-auto pb-8 gap-4 md:grid md:grid-cols-4 md:gap-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                    {displayVideos.map((video) => {
                        const videoId = extractYoutubeVideoId(video.url);
                        if (!videoId) return null;

                        return (
                            <YoutubeShortsCard
                                key={video._id}
                                videoId={videoId}
                                isPlaying={currentlyPlayingId === video._id}
                                onPlay={() => handlePlay(video._id)}
                                onPause={handlePause}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
