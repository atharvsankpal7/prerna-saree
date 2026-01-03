'use client';

import { motion } from 'framer-motion';
import CustomerReviewCard from './CustomerReviewCard';

const reviews = [
  {
    id: 1,
    rating: 5,
    review:
      'The quality and detailing are outstanding. Truly elegant sarees.',
    customerName: 'Savita Jadhav',
    date: '12/4/2024',
    imageUrl:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    rating: 5,
    review:
      'Absolutely loved the fabric and the beautiful border work. Perfect for any occasion.',
    customerName: 'Priya Sharma',
    date: '18/4/2024',
    imageUrl:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    rating: 5,
    review:
      'Exceptional craftsmanship! The customization options made it so special and unique.',
    customerName: 'Anita Desai',
    date: '25/4/2024',
    imageUrl:
      'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function CustomerReviewsSection() {
  return (
    <section id="customer-reviews" className="relative py-20 md:py-32 bg-gradient-to-b from-white via-pink-50/30 to-pink-100/30 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.08),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-pink-600 font-body text-sm font-bold tracking-widest uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#93316a] tracking-tight leading-tight mb-6">
            Loved By Thousands
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-body leading-relaxed"
          >
            Hear what our customers have to say about their experience with our sarees.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {reviews.map((review, index) => (
            <CustomerReviewCard
              key={review.id}
              rating={review.rating}
              review={review.review}
              customerName={review.customerName}
              date={review.date}
              imageUrl={review.imageUrl}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-lg mb-8 font-body">
            Join hundreds of satisfied customers
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#93316a] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#7a2858] shadow-lg hover:shadow-xl transition-all font-body tracking-wide"
          >
            Read More Reviews
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
