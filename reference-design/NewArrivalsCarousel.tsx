

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const sareeImages = [
  'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3452356/pexels-photo-3452356.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1689733/pexels-photo-1689733.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export default function NewArrivalsCarousel() {
  const duplicatedImages = [...sareeImages, ...sareeImages];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-pink-600 font-body text-sm font-bold tracking-widest uppercase mb-3 block">
          Fresh From The Looms
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#93316a] mb-4"
        >
          New Arrivals
        </motion.h2>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto" />
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8"
          animate={{
            x: [0, -100 * sareeImages.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 50,
              ease: 'linear',
            },
          }}
        >
          {duplicatedImages.map((image, index) => (
            <motion.div
              key={index}
              className="relative flex-shrink-0 w-[280px] h-[420px] md:w-[340px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
              whileHover={{ y: -10 }}
            >
              <Image
                src={image}
                alt={`New arrival saree ${(index % sareeImages.length) + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 280px, 340px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xl font-heading font-bold mb-1">Silk Collection</p>
                <div className="flex items-center gap-2 text-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span className="text-sm font-body font-medium tracking-wide uppercase">Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#93316a] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#7a2858] shadow-lg hover:shadow-xl transition-all font-body tracking-wide flex items-center gap-2 mx-auto"
        >
          View All New Arrivals
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
