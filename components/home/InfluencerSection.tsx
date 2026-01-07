'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IM_Fell_English } from 'next/font/google';
import YoutubeShortsCard, { extractYoutubeVideoId } from './YoutubeShortsCard';

const imFellEnglish = IM_Fell_English({ subsets: ['latin'], weight: '400' });

interface InfluencerVideo {
    _id: string;
    url: string;
    creatorName: string;
    reviewSummary: string;
}

interface InfluencerSectionProps {
    videos: InfluencerVideo[];
}

export default function InfluencerSection({ videos }: InfluencerSectionProps) {
    // Track which video is currently playing (null means no video is playing)
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

    // Fallback if no videos
    const displayVideos = videos.length > 0 ? videos : [
        { _id: '1', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', creatorName: 'Influencer 1', reviewSummary: 'Great!' },
        { _id: '2', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', creatorName: 'Influencer 2', reviewSummary: 'Loved it' },
        { _id: '3', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', creatorName: 'Influencer 3', reviewSummary: 'Amazing' },
        { _id: '4', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', creatorName: 'Influencer 4', reviewSummary: 'Perfect' },
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
        <section id="influencer-feedback" className="relative py-20 md:py-32 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl ${imFellEnglish.className} font-bold text-[#93316a] mb-6 leading-tight`}>
                        Influencer Feedback<br className="hidden md:block" />
                    </h2>
                </motion.div>

                {/* YouTube Grid/Carousel */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative"
                >
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
                                    creatorName={video.creatorName}
                                    reviewSummary={video.reviewSummary}
                                />
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
