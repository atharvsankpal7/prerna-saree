import Link from 'next/link';

export default function Collections({ categories }: { categories: any[] }) {
    if (!categories || categories.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Exclusive Collections</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <Link
                        key={category._id}
                        href={`/products?category=${category.slug}`}
                        className="group relative overflow-hidden rounded-lg aspect-square"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                            <h3 className="text-white text-xl font-bold tracking-wide">{category.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
