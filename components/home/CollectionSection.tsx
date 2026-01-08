'use client';

import CollectionCard from './CollectionCard';
import Link from 'next/link';
import Image from 'next/image';
import { Montez } from 'next/font/google';
import { motion } from 'framer-motion';
const montez = Montez({ subsets: ['latin'], weight: '400' });

interface Category {
    _id: string;
    name: string;
    image: string;
    slug: string;
}

interface CollectionSectionProps {
    categories: Category[];
}

export default function CollectionSection({ categories }: CollectionSectionProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="relative bg-gradient-to-b from-white via-pink-50/30 to-rose-50/30 overflow-hidden">


            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section header */}
                <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0"
                        >
                            <Image src="/flower.png" alt="flower" fill className="object-contain" />
                        </motion.div>

                        <h2 className={`text-lg md:text-5xl lg:text-6xl italic font-bold  text-[#93316a] tracking-tight leading-tight `}>
                            Our Exclusive Collections
                        </h2>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0"
                        >
                            <Image src="/flower.png" alt="flower" fill className="object-contain" />
                        </motion.div>
                    </div>
                </div>

                {/* Collections grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
                    {categories.map((category, index) => (
                        <CollectionCard
                            key={category._id}
                            title={category.name}
                            image={category.image}
                            slug={category.slug}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-10 text-center">
                    <Link
                        href="/products"
                        className="group inline-flex items-center justify-center px-8 py-2.5 bg-[#93316a] text-white text-sm font-semibold rounded-full hover:bg-[#7a2858] transition-all duration-300 shadow-md hover:shadow-lg font-body tracking-wide"
                    >
                        View All Collections
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">
                            →
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
