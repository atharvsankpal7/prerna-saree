'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, Sparkles, Heart, Package } from 'lucide-react';

interface DispatchVideo {
    _id: string;
    url: string;
    thumbnail: string;
}

interface DispatchMagicSectionProps {
    videos: DispatchVideo[];
}

export default function DispatchMagicSection({ videos }: DispatchMagicSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    // Fallback if no videos
    const displayVideos = videos.length > 0 ? videos : [
        {
            _id: '1',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
            _id: '2',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        }
    ];

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <section id="dispatch-magic" ref={containerRef} className="relative py-24 md:py-32 overflow-hidden bg-[#fff0f5]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#93316a] via-pink-600 to-[#93316a] mb-6 pb-2 drop-shadow-sm"
                    >
                        Dispatch Magic
                    </motion.h2>


                </div>

                {/* Video Carousel / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {displayVideos.map((video, index) => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-black cursor-pointer"
                            onClick={() => setActiveVideo(video._id)}
                        >
                            {/* Placeholder / Thumbnail */}
                            <img
                                src={video.thumbnail}
                                alt="Video Thumbnail"
                                className="w-full h-full object-contain opacity-90 group-hover:opacity-75 transition-opacity duration-500 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/40">
                                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                                </div>
                            </div>

                            {/* Active Video Overlay (Simulated Embed) */}
                            {activeVideo === video._id && (
                                <div className="absolute inset-0 z-20 bg-black">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}?autoplay=1&controls=0&modestbranding=1&loop=1`}
                                        title="Dispatch Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full object-cover"
                                    ></iframe>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveVideo(null); }}
                                        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 z-30"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
