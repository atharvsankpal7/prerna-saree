'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-[#2b0c1c] py-4 px-6 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Prerna Sarees"
            fill
            className="object-contain rounded-full bg-white/10"
          />
        </Link>

        {/* Center: Brand Name */}
        <div className="flex flex-col items-center justify-center absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-1 font-heading tracking-wide">
            प्रेरणा
          </h1>
          <span className="text-xs md:text-sm text-pink-300 font-serif tracking-widest uppercase">
            By 3 Sisters
          </span>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link
            href="/"
            className="text-white hover:text-pink-400 transition-colors text-base md:text-lg font-medium font-body"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-white hover:text-pink-400 transition-colors text-base md:text-lg font-medium font-body"
          >
            Collection
          </Link>
        </div>
      </div>
    </nav>
  );
}
