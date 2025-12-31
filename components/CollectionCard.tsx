'use client';

import { type FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <Link href={`/collections/${slug}`} className="block w-full h-full">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-md transition-all duration-500 hover:shadow-2xl" style={{ aspectRatio: '3/4' }}>
          {/* Image */}
          <div className="absolute inset-0">
            <Image
              src={image || '/placeholder.svg'}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-heading font-bold text-white mb-2 leading-tight">
                {title}
              </h3>
              
              <div className="flex items-center gap-2 text-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                <span className="text-sm font-body font-medium tracking-wide uppercase">Explore Collection</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
