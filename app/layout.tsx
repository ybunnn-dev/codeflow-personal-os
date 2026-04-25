// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { Providers } from "./providers"; 

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "CodeFlow",
  description: "Your Personal Operating System",
};

// --- SKELETON LOADER FOR NAVIGATION ---
const SkeletonNav = () => (
  <div className="w-full h-16 bg-[#F4F4F0] dark:bg-slate-900 animate-pulse border-b border-gray-200 dark:border-slate-800 transition-colors duration-300"></div>
);

// --- DYNAMIC IMPORT ---
const LazyNavigation = dynamic(() => import('./(view)/(panel)/global_components/navigation'), {
  loading: () => <SkeletonNav />
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is strictly required when manipulating the HTML class for dark mode
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${montserrat.variable} font-sans antialiased bg-[#F4F4F0] dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
       <Providers>
          {/* Global Navigation loads smoothly with a skeleton */}
          <LazyNavigation />
          
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}