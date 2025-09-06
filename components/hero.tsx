'use client';

import { Geist } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EtheralShadow } from "./ui/etheral-shadow";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Fonts
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export default function Hero() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <EtheralShadow 
      color="#000000"
      animation={{ scale: 100, speed: 90 }}
      noise={{ opacity: 2, scale: 1.2 }}
      sizing="fill"
      style={{ minHeight: '100vh' }}


    >
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="w-full">
          <nav className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className={`${geist.className} text-lg font-medium text-theme-text-primary`}>
                DealHunter
              </div>
              <div className="hidden md:flex items-center space-x-8">
                {["About", "Contact"].map((item) => {
                  if (item === 'Contact') {
                    return (
                      <a
                        key={item}
                        href="https://www.akshatsingh.xyz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${geist.className} text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors`}
                      >
                        {item}
                      </a>
                    )
                  }

                  const href = `/${item.toLowerCase()}`;
                  return (
                    <Link
                      key={item}
                      href={href}
                      className={`${geist.className} text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors`}
                    >
                      {item}
                    </Link>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-theme-text-secondary hover:text-theme-text-primary"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-theme-text-secondary hover:text-theme-text-primary"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-theme-secondary/20 pt-4">
                <div className="flex flex-col space-y-4">
                  {["About", "Contact"].map((item) => {
                    if (item === 'Contact') {
                      return (
                        <a
                          key={item}
                          href="https://www.akshatsingh.xyz/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${geist.className} text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item}
                        </a>
                      )
                    }

                    const href = `/${item.toLowerCase()}`;
                    return (
                      <Link
                        key={item}
                        href={href}
                        className={`${geist.className} text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    )
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setMobileMenuOpen(false);
                    }}
                    className="text-theme-text-secondary hover:text-theme-text-primary justify-start"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </div>
            )}
          </nav>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6 py-12">
              <h1
                className={`${geist.className} text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-theme-text-primary leading-tight animate-fade-in`}
              >
                Your Personal{" "}
                <span className="bg-gradient-to-r from-theme-primary to-orange-400 bg-clip-text text-transparent">
                  Deal Detective
                </span>
              </h1>
              <p
                className={`${geist.className} text-lg md:text-xl text-theme-text-secondary max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-200`}
              >
                Stop overpaying. We find the best deals for you, so you can shop smart and save big.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 animate-fade-in animation-delay-400">
                <Button asChild className="bg-theme-primary text-theme-text-primary border-0 rounded-full px-9 py-4 font-light transition-all duration-300 hover:bg-theme-primary hover:shadow-[0_0_20px_0px_theme(colors.theme.primary/0.5)] hover:scale-105">
                  <Link href="/product-search">
                    Find a Deal
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-theme-secondary/80 text-theme-text-secondary hover:bg-theme-secondary/50 hover:text-theme-text-primary bg-transparent backdrop-blur-sm rounded-full px-9 py-4 font-light transition-colors hover:scale-105"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-theme-secondary/20 animate-fade-in animation-delay-600">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-theme-primary">5+</div>
                  <div className="text-sm text-theme-text-secondary">Platforms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-theme-primary">10K+</div>
                  <div className="text-sm text-theme-text-secondary">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-theme-primary">₹50L+</div>
                  <div className="text-sm text-theme-text-secondary">Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EtheralShadow>
  );
}
