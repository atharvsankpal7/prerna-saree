'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IM_Fell_English } from 'next/font/google';
const imFellEnglish = IM_Fell_English({ subsets: ['latin'], weight: '400' });
import { ArrowRight } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    images: string[];
    category: { name: string };
    price: number;
}

interface NewArrivalsCarouselProps {
    products: Product[];
}

export default function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
    if (!products || products.length === 0) return null;

    const duplicatedProducts = [...products, ...products];

    return (
        <section className="relative py-12 md:py-20 lg:py-32 bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={`text-3xl md:text-4xl lg:text-7xl ${imFellEnglish.className} font-bold text-[#93316a] mb-4 italic`}
                >
                    New Arrivals
                </motion.h2>
                <div className="h-1 w-72 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto" />
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-6 sm:gap-8"
                    style={{
                        // Ensure the container is wide enough
                        width: 'max-content'
                    }}
                    animate={{
                        x: [0, -(372 * products.length)],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: products.length * 5, // Adjust speed based on count
                            ease: 'linear',
                        },
                    }}
                >
                    {duplicatedProducts.map((product, index) => (
                        <Link key={`${product._id}-${index}`} href={`/product/${product._id}`}>
                            <motion.div
                                className="relative flex-shrink-0 w-[220px] sm:w-[280px] md:w-[340px] h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                                whileHover={{ y: -10 }}
                            >
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 220px, (max-width: 1024px) 280px, 340px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className={`text-lg sm:text-xl ${imFellEnglish.className} font-bold mb-1`}>{product.name}</p>
                                    <p className="text-xs sm:text-sm text-pink-200 mb-2">{product.category?.name}</p>
                                    <p className="text-lg sm:text-xl font-bold text-white mb-2">₹{product.price}</p>
                                    <div className="flex items-center gap-2 text-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <span className="text-sm sm:text-base font-body font-medium tracking-wide uppercase">Shop Now</span>
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>

        </section>
    );
}
