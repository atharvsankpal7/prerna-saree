import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ProductSkeleton() {
    return (
        <Card className="h-full border-none shadow-sm">
            <CardContent className="p-0">
                <div className="aspect-[3/4] relative">
                    <Skeleton className="h-full w-full rounded-t-lg" />
                </div>
                <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
                <Skeleton className="h-4 w-1/3" />
            </CardFooter>
        </Card>
    );
}
