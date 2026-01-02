import CollectionCard from './CollectionCard';

interface Collection {
  id: number;
  title: string;
  image: string;
  slug: string;
}

const collections: Collection[] = [
  {
    id: 1,
    title: 'Daily Grace Collection',
    image:
      'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'daily-grace',
  },
  {
    id: 2,
    title: 'Festive Bloom Collection',
    image:
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'festive-bloom',
  },
  {
    id: 3,
    title: 'Bridal Elegance Collection',
    image:
      'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'bridal-elegance',
  },
  {
    id: 4,
    title: 'Cotton Comfort Collection',
    image:
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'cotton-comfort',
  },
  {
    id: 5,
    title: 'Silk Royalty Collection',
    image:
      'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'silk-royalty',
  },
  {
    id: 6,
    title: 'Designer Exclusive Collection',
    image:
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'designer-exclusive',
  },
];

export default function CollectionSection() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-white via-pink-50/30 to-rose-50/30 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-200/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-rose-200/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.05),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-pink-600 font-body text-sm font-bold tracking-widest uppercase mb-3 block">
            Curated For You
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#93316a] tracking-tight leading-tight mb-6">
            Our Exclusive Collections
          </h2>

          {/* Decorative line */}
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-6" />

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-body leading-relaxed">
            Discover our curated collections designed to celebrate every moment of your life with elegance and grace.
          </p>
        </div>

        {/* Collections grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              title={collection.title}
              image={collection.image}
              slug={collection.slug}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 md:mt-24 text-center">
          <p className="text-gray-500 text-lg mb-8 font-body">
            Can't decide? Browse all our collections
          </p>
          <a
            href="/collections"
            className="group inline-flex items-center justify-center px-10 py-4 bg-[#93316a] text-white font-semibold rounded-full hover:bg-[#7a2858] transition-all duration-300 shadow-lg hover:shadow-xl font-body tracking-wide"
          >
            View All Collections
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
