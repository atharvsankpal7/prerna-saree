'use client';

import { Menu, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#2b0c1c] py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button className="text-white hover:opacity-80 transition-opacity">
          <Menu className="w-8 h-8" />
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-serif italic text-white">
            Original Logoo
          </h1>
          <p className="text-sm text-white/90 italic">By 3 Sisters</p>
        </div>

        <button className="text-white hover:opacity-80 transition-opacity">
          <ShoppingCart className="w-7 h-7" />
        </button>
      </div>
    </nav>
  );
}
