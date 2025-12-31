

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight, Sparkles } from 'lucide-react';

const features = [
  'Customize the Border, Define Your Elegance',
  'Because Every Saree Should Feel Personal',
  'Designed by You, Crafted by Us',
  'Borders That Speak Your Style',
  'From Your Imagination to a Perfect Drape',
];

export default function CustomizeSection() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-pink-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-pink-600 font-body text-sm font-bold tracking-widest uppercase mb-3 block">
            Bespoke Elegance
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#93316a] mb-6 leading-tight"
          >
            Your Style. Your Border. <br className="hidden md:block" />
            <span className="italic font-serif font-light text-[#461934]">Your Prerna Saree.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-5 group"
                >
                  <span className="text-lg md:text-xl text-gray-700 leading-relaxed font-body font-medium group-hover:text-[#93316a] transition-colors duration-300">
                    - {feature}
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-[#93316a] text-white px-10 py-4 rounded-full font-semibold flex items-center gap-3 shadow-lg"
              >
                Start Customizing
                <ChevronRight className="w-5 h-5 " />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[500px] lg:h-[650px] rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Custom Saree Design"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-sm font-body tracking-widest uppercase mb-2 opacity-90">Exclusive Service</p>
              <h3 className="text-2xl font-heading font-bold">Handcrafted to Perfection</h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
