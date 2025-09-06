import { NextRequest, NextResponse } from 'next/server';
import { SearchResultItem } from '@/lib/types';

// Simple in-memory cache
const cache = new Map<string, { data: SearchResultItem[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Product Scrapers
import { scrapeAmazon } from '@/lib/scrapers/amazon';
import { scrapeFlipkart } from '@/lib/scrapers/flipkart';

// Grocery Scrapers
import { scrapeBlinkit } from '@/lib/scrapers/blinkit';
import { scrapeZepto } from '@/lib/scrapers/zepto';
import { scrapeSwiggy } from '@/lib/scrapers/swiggy';

type ScraperFunction = (searchTerm: string) => Promise<SearchResultItem[]>;

const scrapers: Record<string, ScraperFunction[]> = {
  products: [scrapeAmazon, scrapeFlipkart],
  grocery: [scrapeSwiggy, scrapeBlinkit, scrapeZepto],
  // food: [scrapeZomato, scrapeSwiggyRestaurants], // Future category
  // hotels: [scrapeAirbnb, scrapeBooking],         // Future category
};

function normalizePrice(price: string): number {
    if (!price) return Infinity;
    return parseFloat(price.replace(/[₹,]/g, ''));
}

export async function POST(request: NextRequest) {
  try {
    const { searchTerm, category } = await request.json();

    if (!searchTerm || !category) {
      return NextResponse.json({ error: 'Search term and category are required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `${category}:${searchTerm.toLowerCase().trim()}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`Returning cached results for: ${cacheKey}`);
      return NextResponse.json(cached.data);
    }

    const scraperFunctions = scrapers[category];
    if (!scraperFunctions) {
      return NextResponse.json({ error: 'Invalid category specified' }, { status: 400 });
    }
    
    console.log(`API: Starting '${category}' search for "${searchTerm}"`);

    const results = await Promise.allSettled(
      scraperFunctions.map(scraper => scraper(searchTerm))
    );

    let allProducts: SearchResultItem[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allProducts = allProducts.concat(result.value);
        console.log(`Scraper ${index + 1} succeeded with ${result.value.length} products`);
      } else {
        console.error(`Scraper ${index + 1} failed:`, result.reason);
      }
    });

    if (allProducts.length === 0) {
      console.log('API: No products found on any platform.');
      return NextResponse.json({ error: 'Could not find the product on any platform.' }, { status: 404 });
    }

    // Filter products by relevance score first, then by price
    const filteredProducts = allProducts
        .filter(product => (product as any).relevanceScore > 0) // Only keep relevant products
        .map(product => ({
            ...product,
            normalizedPrice: normalizePrice(product.price)
        }))
        .filter(product => isFinite(product.normalizedPrice))
        .sort((a, b) => {
            // Sort by relevance first, then by price
            const aScore = (a as any).relevanceScore || 0;
            const bScore = (b as any).relevanceScore || 0;
            if (aScore !== bScore) {
                return bScore - aScore;
            }
            return a.normalizedPrice - b.normalizedPrice;
        });

    const top5Results = filteredProducts.slice(0, 5);
    
    console.log(`API: Found ${allProducts.length} total items. Returning top ${top5Results.length}.`);

    // Cache the results
    cache.set(cacheKey, { data: top5Results, timestamp: Date.now() });

    return NextResponse.json(top5Results);

  } catch (error: any) {
    console.error('API Error in /api/search:', error.message);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
} 