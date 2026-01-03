'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Star, Zap, Instagram } from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    icon: MessageSquare,
    label: 'Influencer Feedback',
    description: 'Trusted by fashion icons',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
  },
  {
    icon: Star,
    label: 'Customer Review',
    description: 'Loved by thousands',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
  },
  {
    icon: Zap,
    label: 'Dispatch Magic',
    description: 'Lightning fast delivery',
    color: 'from-pink-500 to-fuchsia-500',
    bg: 'bg-fuchsia-50',
  },
];

const instagramVideos = [
  {
    id: 1,
    embedUrl: 'https://www.instagram.com/reel/DNknvPgCU5_/embed',
  },
  {
    id: 2,
    embedUrl: 'https://www.instagram.com/reel/DNfrjVxipa3/embed',
  },
  {
    id: 3,
    embedUrl: 'https://www.instagram.com/reel/DP1TrgDEXds/embed',
  },
  {
    id: 4,
    embedUrl: 'https://www.instagram.com/reel/DS7USWtAqjH/embed',
  },
];

export default function CelebrationSection() {
  // const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="influencer-feedback" className="relative py-20 md:py-32 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">


      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-pink-800 text-sm font-semibold tracking-wide mb-4 font-body">
            #PrernaSareeMoments
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#93316a] mb-6 leading-tight">
            Influencer Feedback<br className="hidden md:block" />
            <span className="max-w-2xl mx-auto text-gray-600 font-body text-lg ">“Loved, Styled & Recommended by Influencers”</span>
          </h2>
          <p className="italic font-serif font-light text-[#461934] text-2xl">
            Where tradition meets modern fashion through trusted voices.
          </p>
        </motion.div>



        {/* Instagram Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-heading font-bold text-gray-800">Latest from Instagram</h3>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[#93316a] font-semibold hover:text-[#461934] transition-colors flex items-center gap-2 font-body">
              View All <Instagram className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {instagramVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer"

              >
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white aspect-[9/16] border border-gray-100">


                  <iframe
                    src={video.embedUrl}
                    className="w-full h-full border-0 object-cover"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title={`Instagram video ${video.id}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-[#93316a] hover:bg-[#7a2858] text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all font-body tracking-wide"
          >
            <Instagram className="w-5 h-5" />
            Follow @3sisters
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
