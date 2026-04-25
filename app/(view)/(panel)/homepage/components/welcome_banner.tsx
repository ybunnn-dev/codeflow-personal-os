// app/(view)/(panel)/homepage/components/welcome_banner.tsx

import React from 'react';
import Image from 'next/image';
import devIcon from '../../../icons/dev.png'; 

export default function WelcomeBanner() {
  return (
    <div className="w-full bg-[#F2E5B2] dark:bg-slate-800/50 rounded-xl mb-12 shadow-sm mt-4 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 border border-transparent dark:border-slate-700/50 transition-colors duration-300">
      
      {/* Profile/Dev Icon (Moved up so it renders on the left) */}
      <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 relative bg-white/50 dark:bg-slate-700/50 rounded-full shadow-inner overflow-hidden border-4 border-white/60 dark:border-slate-600/50">
        <Image 
          src={devIcon} 
          alt="Developer Icon" 
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 max-w-2xl items-center text-center lg:text-start">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
          Hi, I am Ivan. <br />
          <span className="text-[#D98A5F] dark:text-[#E2A07D]">The creator of CodeFlow.</span>
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          CodeFlow is my personal operating system. It serves as a central hub containing custom tools and applications that I build and integrate whenever I feel the need for them.
        </p>
      </div>

    </div>
  );
}