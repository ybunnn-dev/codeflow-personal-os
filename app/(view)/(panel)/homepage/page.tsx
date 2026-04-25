// app/(view)/(panel)/homepage/page.tsx

import React from 'react';
import WelcomeBanner from './components/welcome_banner';
import ToolsSection from './components/tools';

export default function Homepage() {
  return (
    <div className="p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <WelcomeBanner />
        
        <ToolsSection />

      </div>
    </div>
  );
}