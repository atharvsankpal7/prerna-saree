'use client';

import { Montez } from 'next/font/google';
import YoutubeShortsCard, { extractYoutubeVideoId } from './YoutubeShortsCard';
import Image from 'next/image';
import { motion } from 'framer-motion';

const montez = Montez({ subsets: ['latin'], weight: '400' });

interface DispatchVideo {
    _id: string;
    url: string;
    thumbnail?: string;
}

interface DispatchMagicSectionProps {
    videos: DispatchVideo[];
}

export default function DispatchMagicSection({ videos }: DispatchMagicSectionProps) {

    return (
        <section id="dispatch-magic" className="relative  overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-3">
                    <div className="flex items-center justify-center gap-2 md:gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex-shrink-0"
                        >
                            <Image src="/flower.png" alt="flower" fill className="object-contain" />
                        </motion.div>

                        <h2 className={`text-4xl sm:text-5xl md:text-7xl ${montez.className} font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#93316a] via-pink-600 to-[#93316a]  drop-shadow-sm`}>
                            Prerna Magic
                        </h2>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex-shrink-0"
                        >
                            <Image src="/flower.png" alt="flower" fill className="object-contain" />
                        </motion.div>
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                    {videos.map((video) => {
                        const videoId = extractYoutubeVideoId(video.url);
                        if (!videoId) return null;

                        return (
                            <div key={video._id} className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px]">
                                <YoutubeShortsCard videoId={videoId} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
