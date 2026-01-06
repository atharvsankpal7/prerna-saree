'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { IM_Fell_English } from 'next/font/google';

const imFellEnglish = IM_Fell_English({ subsets: ['latin'], weight: '400' });

interface CustomerReviewCardProps {
    rating: number;
    review: string;
    customerName: string;
    date: string;
    imageUrl?: string;
    index?: number;
}

export default function CustomerReviewCard({
    rating,
    review,
    customerName,
    date,
    imageUrl,
    index = 0,
}: CustomerReviewCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="group relative h-full"
        >
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-pink-100 group-hover:border-pink-200">
                <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 ${i < rating
                                ? 'fill-[#93316a] text-[#93316a]'
                                : 'fill-gray-200 text-gray-200'
                                }`}
                        />
                    ))}
                </div>

                <blockquote className="flex-1 mb-8">
                    <p className={`text-xl ${imFellEnglish.className} font-medium text-gray-800 leading-relaxed italic`}>
                        "{review}"
                    </p>
                </blockquote>

                <div className="flex items-center gap-5 mt-auto border-t border-gray-100 pt-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Image
                            src={imageUrl || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'} // Fallback
                            alt={customerName}
                            fill
                            className="object-contain"
                            sizes="64px"
                        />
                    </div>

                    <div className="flex flex-col">
                        <h3 className={`text-lg font-bold ${imFellEnglish.className} text-gray-900`}>
                            {customerName}
                        </h3>
                        <p className="text-gray-500 text-sm font-body">Verified Buyer • {date}</p>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
            </div>
        </motion.div>
    );
}
