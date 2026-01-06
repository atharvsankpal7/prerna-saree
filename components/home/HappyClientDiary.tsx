'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { IM_Fell_English } from 'next/font/google';

const imFellEnglish = IM_Fell_English({ subsets: ['latin'], weight: '400' });

const STATIC_VIDEO = {
    _id: '1',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

export default function HappyClientDiary() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <section id="dispatch-magic" ref={containerRef} className="relative py-24 md:py-32 overflow-hidden bg-[#fff0f5]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`text-5xl md:text-7xl ${imFellEnglish.className} font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#93316a] via-pink-600 to-[#93316a] mb-6 pb-2 drop-shadow-sm`}
                    >
                        Happy Client Diary
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black cursor-pointer group mx-auto"
                    onClick={() => setIsPlaying(true)}
                >
                    {!isPlaying ? (
                        <>
                            <img
                                src={STATIC_VIDEO.thumbnail}
                                alt="Video Thumbnail"
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/40 shadow-xl">
                                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 z-20 bg-black">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYoutubeId(STATIC_VIDEO.url)}?autoplay=1&modestbranding=1&rel=0`}
                                title="Dispatch Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                                className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-30"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
