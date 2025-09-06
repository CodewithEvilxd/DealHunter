'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Inter, Instrument_Serif as InstrumentSerif } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const instrumentSerif = InstrumentSerif({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['400'],
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-theme-background text-theme-text-primary">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-theme-text-secondary hover:text-theme-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>

        <div className="space-y-8">
          <h1 className={`${instrumentSerif.className} text-5xl md:text-6xl text-theme-text-primary`}>
            About DealHunter
          </h1>
          <div className={`${inter.className} space-y-6 text-lg text-theme-text-secondary leading-relaxed`}>
            <p>
              DealHunter is an intelligent price comparison platform that leverages cutting-edge web scraping technology to analyze millions of products across India's leading e-commerce platforms. Our mission is to empower smart shoppers with real-time price intelligence.
            </p>
            <p>
              Simply enter any product you're interested in, and our advanced algorithms will instantly scan Amazon, Flipkart, Swiggy Instamart, Zepto, and Blinkit to identify the absolute best deals available. We help you make informed purchasing decisions and maximize your savings.
            </p>
            <p>
              Built with modern web technologies and optimized for speed, DealHunter delivers lightning-fast results with a clean, intuitive interface. We're committed to being your trusted shopping companion - completely independent and not affiliated with any retailer.
            </p>
            <div className="bg-theme-surface/50 p-6 rounded-lg border border-theme-secondary/30">
              <h3 className="text-xl font-semibold text-theme-text-primary mb-3">Why Choose DealHunter?</h3>
              <ul className="space-y-2 text-theme-text-secondary">
                <li>• <strong>Multi-Platform Search:</strong> Compare across 5+ major platforms simultaneously</li>
                <li>• <strong>Real-Time Pricing:</strong> Fresh data with intelligent caching</li>
                <li>• <strong>Smart Filtering:</strong> Automatically sorts by best price</li>
                <li>• <strong>Fast & Reliable:</strong> Optimized scraping with timeout protection</li>
                <li>• <strong>Free to Use:</strong> No hidden fees or premium features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 