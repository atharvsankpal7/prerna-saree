'use client';

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

    return (
        <section id="dispatch-magic" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className={`text-4xl sm:text-5xl md:text-7xl ${imFellEnglish.className} font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#93316a] via-pink-600 to-[#93316a] mb-4 md:mb-6 pb-2 drop-shadow-sm`}>
                        Prerna Magic
                    </h2>
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
