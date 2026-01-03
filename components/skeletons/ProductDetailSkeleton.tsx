import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Image Gallery */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-4 w-20">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="w-20 h-24 rounded-md" />
                        ))}
                    </div>
                    <div className="flex-1">
                        <Skeleton className="w-full h-[600px] rounded-lg" />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/3" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-4 w-1/2" />
                            ))}
                        </div>
                    </div>

                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-14 w-full rounded-full" />
                </div>
            </div>
        </div>
    );
}
