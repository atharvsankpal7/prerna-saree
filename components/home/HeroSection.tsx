'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

interface HeroSectionProps {
    images: string[];
}

export default function HeroSection({ images }: HeroSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Fallback images if none provided
    const displayImages = images.length > 0 ? images : [
        'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/3452356/pexels-photo-3452356.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1689733/pexels-photo-1689733.jpeg?auto=compress&cs=tinysrgb&w=600',
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayImages.length);
        }, 4000); // Slower interval for better viewing

        return () => clearInterval(interval);
    }, [displayImages.length]);

    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedImage]);

    const getImageIndex = (offset: number) => {
        return (currentIndex + offset + displayImages.length) % displayImages.length;
    };

    const desktopPositions = [
        { index: getImageIndex(-2), scale: 0.6, zIndex: 1, x: -350, y: 100, rotate: -5 },
        { index: getImageIndex(-1), scale: 0.75, zIndex: 2, x: -180, y: 50, rotate: -3 },
        { index: getImageIndex(0), scale: 1, zIndex: 3, x: 0, y: 0, rotate: 0 },
        { index: getImageIndex(1), scale: 0.75, zIndex: 2, x: 180, y: 50, rotate: 3 },
        { index: getImageIndex(2), scale: 0.6, zIndex: 1, x: 350, y: 100, rotate: 5 },
    ];

    const mobilePositions = [
        { index: getImageIndex(-2), scale: 0.6, zIndex: 1, x: -140, y: 60, rotate: -5 },
        { index: getImageIndex(-1), scale: 0.75, zIndex: 2, x: -80, y: 30, rotate: -3 },
        { index: getImageIndex(0), scale: 1, zIndex: 3, x: 0, y: 0, rotate: 0 },
        { index: getImageIndex(1), scale: 0.75, zIndex: 2, x: 80, y: 30, rotate: 3 },
        { index: getImageIndex(2), scale: 0.6, zIndex: 1, x: 140, y: 60, rotate: 5 },
    ];

    const imagePositions = isMobile ? mobilePositions : desktopPositions;

    return (
        <section className="relative min-h-screen bg-gradient-to-b from-[#93316a] to-[#461934] overflow-hidden flex items-center">
            {/* Background Pattern/Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white space-y-8 text-center lg:text-left z-10"
                    >
                        <div className="space-y-2">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-heading tracking-wide">
                                Three Sisters...,
                            </h2>
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium font-heading text-[#ffb6e6]">
                                Six Yards,
                            </h3>
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading">
                                Endless Stories.
                            </h3>
                        </div>

                        <p className="text-lg md:text-xl text-white/80 max-w-lg mx-auto lg:mx-0 font-body leading-relaxed">
                            Discover the elegance of tradition woven into every thread. A collection that celebrates heritage, grace, and you.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-semibold flex items-center gap-3 transition-all shadow-xl mx-auto lg:mx-0 font-body tracking-wider"
                        >
                            Explore Collection
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>

                    {/* Image Carousel */}
                    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full flex items-center justify-center perspective-1000">
                        <AnimatePresence mode="popLayout">
                            {imagePositions.map((pos, i) => (
                                <motion.div
                                    key={`${pos.index}-${i}`}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{
                                        opacity: 1,
                                        scale: pos.scale,
                                        x: pos.x,
                                        y: pos.y,
                                        rotate: pos.rotate,
                                        zIndex: pos.zIndex,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.43, 0.13, 0.23, 0.96],
                                    }}
                                    className="absolute origin-center"
                                    style={{
                                        width: isMobile ? (pos.scale === 1 ? '220px' : '180px') : (pos.scale === 1 ? '320px' : '260px'),
                                        height: isMobile ? (pos.scale === 1 ? '330px' : '270px') : (pos.scale === 1 ? '480px' : '390px'),
                                    }}
                                >
                                    <div
                                        className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/20 cursor-pointer hover:border-white/50 transition-colors"
                                        onClick={() => setSelectedImage(displayImages[pos.index])}
                                    >
                                        <img
                                            src={displayImages[pos.index]}
                                            alt={`Saree Collection ${pos.index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                    {displayImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/30 w-2 hover:bg-white/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors p-2"
                                aria-label="Close modal"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="relative rounded-lg overflow-hidden shadow-2xl">
                                <img
                                    src={selectedImage}
                                    alt="Full view"
                                    className="w-full h-full object-contain max-h-[85vh]"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
