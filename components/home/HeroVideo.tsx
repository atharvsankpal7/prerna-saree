'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function HeroVideo() {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    useEffect(() => {
        if (!videoRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting && videoRef.current) {
                        videoRef.current.muted = true;
                        setIsMuted(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        observer.observe(videoRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section className="relative w-full h-full pt-4 md:h-screen overflow-hidden group">
            {/* Video Background */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                loop
                playsInline
                src="/heroVideo.mp4"
            />

            <button
                onClick={toggleMute}
                className="absolute bottom-8 right-8 p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-white border-[#93316a] border-2  transition-all duration-300 shadow-lg z-20"
            >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
        </section>
    );
}
