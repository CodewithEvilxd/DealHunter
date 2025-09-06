import Link from "next/link";
import { Github, Twitter, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-theme-surface border-t border-theme-secondary/20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-theme-text-primary">DealHunter</h3>
            <p className="text-theme-text-secondary text-sm">
              Your intelligent shopping companion. Find the best deals across all major platforms.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-theme-text-secondary hover:text-theme-text-primary">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-theme-text-secondary hover:text-theme-text-primary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-theme-text-secondary hover:text-theme-text-primary">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-theme-text-primary">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-theme-text-secondary hover:text-theme-text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="block text-theme-text-secondary hover:text-theme-text-primary transition-colors">
                About
              </Link>
              <Link href="/product-search" className="block text-theme-text-secondary hover:text-theme-text-primary transition-colors">
                Search
              </Link>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-theme-text-primary">Supported Platforms</h4>
            <div className="space-y-2 text-sm text-theme-text-secondary">
              <div>Amazon</div>
              <div>Flipkart</div>
              <div>Swiggy Instamart</div>
              <div>Zepto</div>
              <div>Blinkit</div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-theme-text-primary">Contact</h4>
            <div className="space-y-2 text-sm text-theme-text-secondary">
              <p>Have questions or feedback?</p>
              <a
                href="https://www.akshatsingh.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-primary hover:underline"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-theme-secondary/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-theme-text-secondary text-sm">
            © 2024 DealHunter. All rights reserved.
          </p>
          <p className="text-theme-text-secondary text-sm flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> for smart shoppers
          </p>
        </div>
      </div>
    </footer>
  );
}