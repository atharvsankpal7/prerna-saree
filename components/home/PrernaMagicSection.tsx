'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { IM_Fell_English } from 'next/font/google';

const imFellEnglish = IM_Fell_English({ subsets: ['latin'], weight: '400' });

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
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

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

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center">
                    {displayVideos.map((video, index) => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative aspect-[9/16] w-full max-w-[280px] sm:max-w-none rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-black cursor-pointer border-2 md:border-4 border-white/50"
                            onClick={() => setActiveVideo(video._id)}
                        >
                            <img
                                src={video.thumbnail}
                                alt="Shorts Thumbnail"
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-500 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/40">
                                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-1" />
                                </div>
                            </div>

                            {activeVideo === video._id && (
                                <div className="absolute inset-0 z-20 bg-black">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}?autoplay=1&controls=1&modestbranding=1&loop=1&rel=0`}
                                        title="Dispatch Shorts"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveVideo(null); }}
                                        className="absolute top-2 right-2 md:top-4 md:right-4 text-white bg-black/50 rounded-full p-1.5 md:p-2 hover:bg-black/70 z-30 backdrop-blur-sm"
                                    >
                                        <X className="w-4 h-4 md:w-5 md:h-5" />
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
