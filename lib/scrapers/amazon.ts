import puppeteer from 'puppeteer';
import { SearchResultItem } from '../types';

async function scrapeAmazonInternal(searchTerm: string): Promise<SearchResultItem[]> {
  let browser;

  try {
    console.log(`Searching Amazon for: ${searchTerm}`);

    browser = await puppeteer.launch({
      headless: "new" as any,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-ipc-flooding-protection'
      ]
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(searchTerm)}&ref=nb_sb_noss`;
    console.log(`Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);

    const possibleSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item',
      '[data-asin]:not([data-asin=""])',
      '.sg-col-inner .s-widget-container'
    ];

    let productElements = null;
    let usedSelector = '';

    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          productElements = elements;
          usedSelector = selector;
          console.log(`Found ${elements.length} Amazon products using selector: ${selector}`);
          break;
        }
      } catch (err) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!productElements || productElements.length === 0) {
      console.log('No Amazon product elements found with any selector');
      return [];
    }

    const products = await page.evaluate((pageUrl, selector, searchTerm) => {
      const results: SearchResultItem[] = [];
      const productElements = document.querySelectorAll(selector);
      const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 2);

      productElements.forEach((element) => {
        if (results.length >= 15) return; // Get more results for better filtering

        const productData: any = { platform: 'Amazon' };

        try {
            const titleSelectors = [
                'h2.a-size-mini span.a-text-normal',
                'span.a-size-medium.a-color-base.a-text-normal',
                'h2.a-size-medium span',
                'h2 a span'
            ];
            for (const sel of titleSelectors) {
                const el = element.querySelector(sel);
                if (el && el.textContent?.trim()) {
                    productData.title = el.textContent.trim();
                    break;
                }
            }

            const priceSelectors = ['.a-price-whole', '.a-price .a-offscreen'];
            for (const sel of priceSelectors) {
                const el = element.querySelector(sel);
                if (el && el.textContent?.trim()) {
                    productData.price = el.textContent.trim();
                    break;
                }
            }

            const imageEl = element.querySelector('img.s-image') as HTMLImageElement;
            if (imageEl) {
                productData.image = imageEl.src;
            }

            const linkEl = element.querySelector('a.a-link-normal.s-no-outline') as HTMLAnchorElement;
            if (linkEl) {
                const href = linkEl.href;
                if (href && !href.includes('javascript:void(0)')) {
                    productData.link = new URL(href, pageUrl).href;
                }
            }

            const ratingEl = element.querySelector('span.a-icon-alt');
            if (ratingEl && ratingEl.textContent) {
                productData.rating = ratingEl.textContent.trim();
            }

            // Only add if we have all required fields
            if (productData.title && productData.link && productData.price) {
                // Calculate relevance score
                const title = productData.title.toLowerCase();
                let relevanceScore = 0;

                // Exact matches get highest score
                if (title.includes(searchTerm.toLowerCase())) {
                    relevanceScore += 100;
                }

                // Partial word matches
                searchWords.forEach(word => {
                    if (title.includes(word)) {
                        relevanceScore += 50;
                    }
                });

                // Boost score for products with ratings
                if (productData.rating) {
                    relevanceScore += 10;
                }

                productData.relevanceScore = relevanceScore;
                results.push(productData as SearchResultItem);
            }
        } catch (err: any) {
          console.log('Error parsing Amazon product:', err.message);
        }
      });

      // Sort by relevance and return top results
      return results
        .sort((a: any, b: any) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 10);
    }, page.url(), usedSelector, searchTerm);

    console.log(`Successfully extracted ${products.length} Amazon products`);
    return products;

  } catch (error: any) {
    console.error(`Amazon scraping error: ${error.message}`);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Wrap with timeout
export async function scrapeAmazon(searchTerm: string): Promise<SearchResultItem[]> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Amazon scraping timeout after 30 seconds')), 30000)
  );

  return Promise.race([
    scrapeAmazonInternal(searchTerm),
    timeoutPromise
  ]).catch(error => {
    console.error('Amazon scraper timed out or failed:', error.message);
    return [];
  });
}

