'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, Sparkles, Heart, Package } from 'lucide-react';

const dispatchVideos = [
    {
        id: 1,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        videoId: 'dQw4w9WgXcQ',
        title: 'Premium Packaging',
        desc: 'Every fold matters'
    },
    {
        id: 2,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        videoId: 'dQw4w9WgXcQ',
        title: 'Quality Check',
        desc: 'Ensuring perfection'
    },
    {
        id: 3,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        videoId: 'dQw4w9WgXcQ',
        title: 'With Love',
        desc: 'Handwritten notes'
    },
    {
        id: 4,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        videoId: 'dQw4w9WgXcQ',
        title: 'Ready to Ship',
        desc: 'On its way to you'
    }
];

export default function DispatchMagicSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const [activeVideo, setActiveVideo] = useState<number | null>(null);

    return (
        <section id="dispatch-magic" ref={containerRef} className="relative py-24 md:py-32 overflow-hidden bg-[#fff0f5]">
            {/* Background Elements */}


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

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl font-serif italic text-[#461934] mb-4"
                    >
                        "From Our Heart to Your Home"
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex items-center justify-center gap-2 text-gray-600 font-body"
                    >
                        <Package className="w-5 h-5 text-pink-500" />
                        <span>Every saree is packed with care, quality, and love.</span>
                        <Heart className="w-5 h-5 text-pink-500" />
                    </motion.div>
                </div>

                {/* Video Carousel / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {dispatchVideos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black cursor-pointer"
                            onClick={() => setActiveVideo(video.id)}
                        >
                            {/* Placeholder / Thumbnail */}
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-500 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/40">
                                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-heading font-bold text-xl mb-1">{video.title}</h3>
                                <p className="text-pink-200 text-sm font-body">{video.desc}</p>
                            </div>

                            {/* Active Video Overlay (Simulated Embed) */}
                            {activeVideo === video.id && (
                                <div className="absolute inset-0 z-20 bg-black">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&controls=0&modestbranding=1&loop=1`}
                                        // Note: In a real app, we'd use the actual video ID. 
                                        // For this demo, I'll use a placeholder or just show the UI state.
                                        // Let's use a generic harmless video or just keep the UI interactive.
                                        // Since I don't have real shorts IDs, I will revert to a UI that shows "Playing" state or similar, 
                                        // OR I can put a real generic short ID if I knew one. 
                                        // I will use a placeholder src that works or just a message.
                                        title={video.title}
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

                {/* Decorative Bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <p className="text-[#93316a]/60 font-serif italic text-lg">
                        ~ Wrapped with elegance, delivered with grace ~
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
