'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function HeroCarousel({ images }: { images: string[] }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="w-full relative">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 4000,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent>
                    {images.map((img, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px]">
                                <img
                                    src={img}
                                    alt={`Hero ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </div>
    );
}
