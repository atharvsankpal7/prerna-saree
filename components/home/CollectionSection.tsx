'use client';

import CollectionCard from './CollectionCard';
import Link from 'next/link';

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
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-pink-50/30 to-rose-50/30 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-200/20 to-transparent rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-rose-200/20 to-transparent rounded-full blur-3xl -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.05),transparent_70%)]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section header */}
                <div className="text-center mb-16 md:mb-24">

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#93316a] tracking-tight leading-tight mb-6">
                        Our Exclusive Collections
                    </h2>


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
                <div className="mt-16 md:mt-24 text-center">
                    <p className="text-gray-500 text-lg mb-8 font-body">
                        Can't decide? Browse all our collections
                    </p>
                    <Link
                        href="/products"
                        className="group inline-flex items-center justify-center px-10 py-4 bg-[#93316a] text-white font-semibold rounded-full hover:bg-[#7a2858] transition-all duration-300 shadow-lg hover:shadow-xl font-body tracking-wide"
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
