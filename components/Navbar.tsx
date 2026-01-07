'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Montez } from 'next/font/google';

const montez = Montez({ subsets: ['latin'], weight: '400' });

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white py-3 md:py-4 px-4 md:px-6 sticky top-0 z-40 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Left: Logo */}
        <Link href="/" className="relative w-12 h-12 md:w-20 md:h-20 flex-shrink-0 z-50">
          <Image
            src="/logo.png"
            alt="Prerna Sarees"
            fill
            className="object-contain rounded-full"
          />
        </Link>

        {/* Center: Brand Name */}
        <div className="flex flex-col items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-40 w-full pointer-events-none">
          <h1 className={`text-2xl md:text-5xl font-bold text-black mb-0 md:mb-1 ${montez.className} tracking-wide`}>
            प्रेरणा
          </h1>
          <span className="text-[10px] md:text-sm text-black font-serif tracking-widest uppercase">
            By 3 Sisters
          </span>
        </div>

        {/* Right: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-black hover:text-pink-600 transition-colors text-lg font-medium font-body"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-black hover:text-pink-600 transition-colors text-lg font-medium font-body"
          >
            Collection
          </Link>
        </div>

        {/* Right: Mobile Menu Button */}
        <button
          className="md:hidden text-black z-50 p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 overflow-hidden md:hidden shadow-xl"
            >
              <div className="flex flex-col items-center gap-6 py-8">
                <Link
                  href="/"
                  className="text-black hover:text-pink-600 transition-colors text-lg font-medium font-body"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-black hover:text-pink-600 transition-colors text-lg font-medium font-body"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collection
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
