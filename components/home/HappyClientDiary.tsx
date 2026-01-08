'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { Montez } from 'next/font/google';
import Image from 'next/image';

const montez = Montez({ subsets: ['latin'], weight: '400' });

export default function HappyClientDiary() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section id="dispatch-magic" ref={containerRef} className="relative pb-5 md:pb-5 overflow-hidden ">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center ">
                    <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
                        <div
                            className="relative w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex-shrink-0 "
                        >
                            <Image src="/flower.png" alt="flower" fill className="object-contain mb-4 md:mb-6" />
                        </div>

                        <h2
                            className={`text-3xl md:text-7xl ${montez.className} font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#93316a] via-pink-600 to-[#93316a] pb-1 mx-1 `}
                        >
                            Happy Client Diary
                        </h2>

                        <div
                            className="relative w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex-shrink-0"
                        >
                            <Image src="/flower.png" alt="flower" fill className="object-contain" />
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                >
                    {!isPlaying ? (
                        <>
                            <img
                                src="/diayr_thumbnail.png"
                                alt="Video Thumbnail"
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/40 shadow-xl">
                                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 z-20 bg-black">
                            <video
                                src="/diary.mp4"
                                className="w-full h-full object-cover"
                                controls
                                autoPlay
                                playsInline
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                                className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-30"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
