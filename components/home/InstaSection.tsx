'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Montez } from 'next/font/google';
import Image from 'next/image';

const montez = Montez({ subsets: ['latin'], weight: '400' });

const STATIC_VIDEOS = [
    { _id: '1', url: 'https://www.instagram.com/reel/DNknvPgCU5_/embed', creatorName: 'Influencer 1', reviewSummary: 'Great!' },
    { _id: '2', url: 'https://www.instagram.com/reel/DNfrjVxipa3/embed', creatorName: 'Influencer 2', reviewSummary: 'Loved it' },
    { _id: '3', url: 'https://www.instagram.com/reel/DP1TrgDEXds/embed', creatorName: 'Influencer 3', reviewSummary: 'Amazing' },
    { _id: '4', url: 'https://www.instagram.com/reel/DS7USWtAqjH/embed', creatorName: 'Influencer 4', reviewSummary: 'Perfect' },
];

export default function InstaSection() {
    const getEmbedUrl = (url: string) => {
        if (!url) return '';

        if (url.includes('instagram.com/reel/')) {
            if (url.includes('/embed')) return url;
            const cleanUrl = url.split('?')[0];
            return cleanUrl.endsWith('/') ? `${cleanUrl}embed` : `${cleanUrl}/embed`;
        }

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            if (id) return `https://www.youtube.com/embed/${id}`;
        }

        return url;
    };

    return (
        <section id="influencer-feedback" className="relative   bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center mb-6"
            >
                <motion.a
                    href="https://www.instagram.com/prerna_saree/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-[#93316a] hover:bg-[#7a2858] text-white px-8 py-1 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all font-body tracking-wide"
                >
                    <Instagram className="w-5 h-5" />
                    Follow @prerna_saree
                </motion.a>
            </motion.div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">


                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h3 className={`text-2xl ${montez.className} font-bold text-gray-800`}>Latest from Instagram</h3>
                        <a href="https://www.instagram.com/prerna_saree/" target="_blank" rel="noreferrer" className="text-[#93316a] font-semibold hover:text-[#461934] transition-colors flex items-center gap-2 font-body">
                            View All <Instagram className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {STATIC_VIDEOS.map((video, index) => (
                            <motion.div
                                key={video._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group cursor-pointer "
                            >
                                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white aspect-[9/16] border border-gray-100">
                                    <iframe
                                        src={getEmbedUrl(video.url)}
                                        className="w-full h-full border-0 object-cover"
                                        allowFullScreen
                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        title={`Instagram video ${video._id}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>


            </div>
        </section>
    );
}
