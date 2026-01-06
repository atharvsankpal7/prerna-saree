'use client';

import { MessageCircle } from 'lucide-react';

export default function RunningBanner() {
  return (
    <div className="bg-[#9bf1ed] overflow-hidden py-2.5 relative z-50">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="inline-flex items-center mx-12 text-black/90 text-sm font-medium font-body tracking-wide">
            <MessageCircle className="w-4 h-4 mr-2.5 text-pink-200" />
            For Orders & Enquiry DM on +91 9104391918
          </span>
        ))}
      </div>
    </div>
  );
}
