import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function NewArrivals({ products }: { products: any[] }) {
    if (!products || products.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
                <Link href="/products" className="text-primary hover:underline">
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                    <Link key={product._id} href={`/product/${product._id}`}>
                        <Card className="h-full hover:shadow-lg transition-shadow border-none shadow-sm">
                            <CardContent className="p-0">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                    />
                                    <Badge className="absolute top-2 left-2 bg-black/70 hover:bg-black/70">New</Badge>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{product.category?.name}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
