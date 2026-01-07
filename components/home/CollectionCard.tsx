'use client';

import { type FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Montez } from 'next/font/google';

const montez = Montez({ subsets: ['latin'], weight: '400' });

interface CollectionCardProps {
    title: string;
    image: string;
    slug: string;
    index?: number;
}

const CollectionCard: FC<CollectionCardProps> = ({
    title,
    image,
    slug,
    index = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative w-full h-full"
        >
            <Link href={`/products?category=${slug}`} className="block w-full h-full">
                <div className="relative w-full h-full p-3 md:p-4 bg-gradient-to-br from-pink-200 via-pink-100 to-rose-200 shadow-md transition-all duration-500 hover:shadow-xl">
                    {/* Image Container */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-white/50">
                        <Image
                            src={image || '/placeholder.svg'}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>

                    {/* Content */}
                    <div className="mt-4 md:mt-6 text-center pb-2">
                        <h3 className={`text-2xl md:text-3xl ${montez.className} font-bold text-[#831843] leading-none`}>
                            {title}
                        </h3>

                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CollectionCard;
