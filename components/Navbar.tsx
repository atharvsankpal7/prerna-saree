'use client';

import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#2b0c1c] py-4 px-6 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button className="text-white hover:opacity-80 transition-opacity">
          <Menu className="w-8 h-8" />
        </button>

        <Link href="/" className="flex flex-col items-center group">
          <h1 className="text-3xl md:text-4xl font-serif italic text-white group-hover:text-pink-200 transition-colors">
            Prerna Sarees
          </h1>
          <p className="text-sm text-white/90 italic group-hover:text-pink-100 transition-colors">By 3 Sisters</p>
        </Link>

        <Link href="/products" className="text-white hover:opacity-80 transition-opacity">
          <ShoppingCart className="w-7 h-7" />
        </Link>
      </div>
    </nav>
  );
}
