'use client';

import { Montez } from 'next/font/google';
import YoutubeShortsCard, { extractYoutubeVideoId } from './YoutubeShortsCard';

const montez = Montez({ subsets: ['latin'], weight: '400' });

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


    return (
        <section id="influencer-feedback" className="relative py-20 md:py-32 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl ${montez.className} font-bold text-[#93316a] mb-6 leading-tight`}>
                        Influencer Feedback
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
