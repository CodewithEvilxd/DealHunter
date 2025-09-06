'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, ArrowLeft, ExternalLink, Sparkles, Star, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { SearchResultItem } from '@/lib/types';
import { Geist } from 'next/font/google';
import { SearchResultsSkeleton } from '@/components/loading-skeleton';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});

const platformColors: Record<string, string> = {
  'Amazon': 'bg-theme-primary',
  'Flipkart': 'bg-blue-600',
  'Swiggy': 'bg-orange-500',
  'Zepto': 'bg-purple-600',
  'Blinkit': 'bg-pink-500',
}

const popularSearches = [
  'iPhone 15',
  'Samsung Galaxy S24',
  'MacBook Air',
  'Dell Laptop',
  'Nike Shoes',
  'Sony Headphones',
  'Coffee',
  'Milk',
  'Bread',
  'Rice 5kg',
  'Cooking Oil'
]

export default function SuperSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('products');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const formatPrice = (priceStr: string): string => {
    if (!priceStr) return 'N/A';
    const cleanPrice = parseFloat(priceStr.replace(/[₹,]/g, ''));
    if (!isNaN(cleanPrice)) {
      return `₹${cleanPrice.toLocaleString('en-IN')}`;
    }
    return priceStr;
  };

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setResults([]);
    setNotFound(false);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm, category: searchCategory }),
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        setNotFound(true);
      }

    } catch (error) {
      console.error('Search failed:', error);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, searchCategory]);

  // Debounced search function
  const debouncedSearch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        handleSearch();
      }
    }, 800); // 800ms delay
  }, [searchTerm, handleSearch]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Filtered and sorted results
  const filteredResults = useMemo(() => {
    let filtered = [...results];

    // Price range filter
    filtered = filtered.filter(item => {
      const price = parseFloat(item.price.replace(/[₹,]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Platform filter
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(item => selectedPlatforms.includes(item.platform));
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(item => {
        const rating = item.rating ? parseFloat(item.rating) : 0;
        return rating >= minRating;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace(/[₹,]/g, '')) - parseFloat(b.price.replace(/[₹,]/g, ''));
        case 'price-high':
          return parseFloat(b.price.replace(/[₹,]/g, '')) - parseFloat(a.price.replace(/[₹,]/g, ''));
        case 'rating':
          const aRating = a.rating ? parseFloat(a.rating) : 0;
          const bRating = b.rating ? parseFloat(b.rating) : 0;
          return bRating - aRating;
        case 'relevance':
        default:
          return 0; // Keep original order (already sorted by relevance from API)
      }
    });

    return filtered;
  }, [results, priceRange, selectedPlatforms, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-theme-background text-theme-text-primary">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-theme-text-secondary hover:text-theme-text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-light text-theme-text-primary mb-4 flex items-center justify-center gap-3`}>
              <Sparkles className="w-10 h-10 text-theme-primary"/> DealHunter Search
            </h1>
            <p className={`text-lg text-theme-text-secondary max-w-2xl mx-auto`}>
              One search for everything. Find the best prices across all major platforms.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-theme-surface border border-theme-secondary/50 shadow-lg mb-8 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="What are you looking for?"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    debouncedSearch();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      if (debounceRef.current) {
                        clearTimeout(debounceRef.current);
                      }
                      handleSearch();
                    }
                  }}
                  className="flex-1 bg-theme-secondary/50 border-theme-secondary text-theme-text-primary placeholder:text-theme-text-secondary focus:bg-theme-secondary/80 focus:border-theme-primary rounded-full"
                />
                <div className="flex gap-4">
                    <Select value={searchCategory} onValueChange={setSearchCategory}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-theme-secondary/50 border-theme-secondary text-theme-text-primary rounded-full">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-theme-surface border-theme-secondary text-theme-text-primary">
                            <SelectItem value="grocery">Groceries</SelectItem>
                            <SelectItem value="products">Products</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()} className="flex-1 bg-theme-primary hover:brightness-110 text-black px-8 rounded-full">
                      {isSearching ? <div className="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full" /> : <><Search className="w-4 h-4 mr-2" /> Search</>}
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Filters */}
          {results.length > 0 && (
            <Card className="bg-theme-surface border border-theme-secondary/50 shadow-lg mb-6 rounded-2xl">
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <CardContent className="p-4 cursor-pointer hover:bg-theme-secondary/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-theme-primary" />
                        <span className="font-medium text-theme-text-primary">Advanced Filters</span>
                        <Badge variant="secondary" className="text-xs">
                          {filteredResults.length} results
                        </Badge>
                      </div>
                      {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-6 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Price Range */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-theme-text-primary">Price Range (₹)</Label>
                        <Slider
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          max={100000}
                          min={0}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-theme-text-secondary">
                          <span>₹{priceRange[0].toLocaleString()}</span>
                          <span>₹{priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Platforms */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-theme-text-primary">Platforms</Label>
                        <div className="space-y-2">
                          {['Amazon', 'Flipkart', 'Swiggy', 'Zepto', 'Blinkit'].map((platform) => (
                            <div key={platform} className="flex items-center space-x-2">
                              <Checkbox
                                id={platform}
                                checked={selectedPlatforms.includes(platform)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPlatforms([...selectedPlatforms, platform]);
                                  } else {
                                    setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                                  }
                                }}
                              />
                              <Label htmlFor={platform} className="text-sm text-theme-text-secondary cursor-pointer">
                                {platform}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Minimum Rating */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-theme-text-primary">Min Rating</Label>
                        <Select value={minRating.toString()} onValueChange={(value) => setMinRating(parseFloat(value))}>
                          <SelectTrigger className="bg-theme-secondary/50 border-theme-secondary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Any Rating</SelectItem>
                            <SelectItem value="3">3+ Stars</SelectItem>
                            <SelectItem value="4">4+ Stars</SelectItem>
                            <SelectItem value="4.5">4.5+ Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort By */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-theme-text-primary">Sort By</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="bg-theme-secondary/50 border-theme-secondary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="mt-6 pt-4 border-t border-theme-secondary/20">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPriceRange([0, 100000]);
                          setSelectedPlatforms([]);
                          setMinRating(0);
                          setSortBy('relevance');
                        }}
                        className="text-theme-text-secondary border-theme-secondary/50 hover:border-theme-primary"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )}

          {!isSearching && results.length === 0 && !notFound && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-theme-text-primary mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm(search);
                      handleSearch();
                    }}
                    className="text-theme-text-secondary hover:text-theme-text-primary border-theme-secondary/50 hover:border-theme-primary"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isSearching && (
            <div className="space-y-4">
                <div className="text-center mb-8">
                    <div className="animate-spin w-12 h-12 border-4 border-theme-primary/20 border-t-theme-primary rounded-full mx-auto"></div>
                    <p className="mt-4 text-theme-text-secondary">Searching across platforms...</p>
                </div>
                <SearchResultsSkeleton />
            </div>
          )}

          {filteredResults.length > 0 && (
            <div className="space-y-4">
              {filteredResults.map((item, index) => (
                <Card key={index} className="bg-theme-surface border border-theme-secondary/50 shadow-lg rounded-2xl animate-fade-in overflow-hidden">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 items-center">
                      <div className="col-span-1 sm:col-span-1 bg-theme-secondary/30 p-2 rounded-lg flex items-center justify-center">
                        <img src={item.image} alt={item.title} className="w-full h-auto object-contain rounded-md max-h-32"/>
                      </div>
                      <div className="col-span-2 sm:col-span-3 space-y-2 text-theme-text-primary">
                        <div className="flex justify-between items-start">
                          <h2 className="font-semibold leading-tight flex-1 mr-2">{item.title}</h2>
                          <Badge className={`${platformColors[item.platform] || 'bg-gray-500'} text-black whitespace-nowrap`}>{item.platform}</Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-xl font-bold text-white">{formatPrice(item.price)}</p>
                            {item.quantity && (
                                <p className="text-sm text-theme-text-secondary">{item.quantity}</p>
                            )}
                        </div>
                        {item.rating && (
                          <div className="flex items-center gap-2 text-sm text-theme-text-secondary">
                            <Star className="w-4 h-4 text-theme-primary fill-theme-primary" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                        <Button asChild size="sm" className="bg-theme-primary hover:brightness-110 text-black rounded-full">
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Deal
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {notFound && (
            <Card className="bg-theme-surface border-theme-secondary/50 shadow-lg rounded-2xl p-12 text-center">
              <h3 className="text-xl font-semibold text-theme-text-primary">No Suitable Products Found</h3>
              <p className="text-theme-text-secondary mt-2">We couldn't find any products matching your search. Please try a different term or category.</p>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
} 