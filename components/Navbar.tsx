'use client';

import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-[#2b0c1c] py-4 px-6 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button >
        </button>

        <Link href="/" className="flex flex-col items-center group">
          <div className="relative w-32 h-12 md:w-40 md:h-16">
            <Image
              src="/logo.png"
              alt="Prerna Sarees"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        <Link
          href="/products"
          className="bg-[#93316a] hover:bg-[#7a2858] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors font-body tracking-wide"
        >
          View Collection
        </Link>
      </div>
    </nav>
  );
}
