import { SearchResultItem, PriceHistory, ProductWithHistory } from './types';

const PRICE_HISTORY_KEY = 'dealhunter_price_history';
const MAX_HISTORY_ENTRIES = 10; // Keep last 10 price points per product

export function getPriceHistory(productId: string): PriceHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const history = localStorage.getItem(PRICE_HISTORY_KEY);
    if (!history) return [];

    const allHistory = JSON.parse(history);
    return allHistory[productId] || [];
  } catch (error) {
    console.error('Error reading price history:', error);
    return [];
  }
}

export function updatePriceHistory(product: SearchResultItem): void {
  if (typeof window === 'undefined') return;

  try {
    const history = localStorage.getItem(PRICE_HISTORY_KEY);
    const allHistory = history ? JSON.parse(history) : {};

    // Create a unique product ID based on title and platform
    const productId = `${product.platform}_${product.title.replace(/\s+/g, '_').toLowerCase()}`;

    if (!allHistory[productId]) {
      allHistory[productId] = [];
    }

    const currentPrice = parseFloat(product.price.replace(/[₹,]/g, ''));
    const now = new Date().toISOString();

    // Add new price entry
    allHistory[productId].push({
      date: now,
      price: currentPrice
    });

    // Keep only the last MAX_HISTORY_ENTRIES
    if (allHistory[productId].length > MAX_HISTORY_ENTRIES) {
      allHistory[productId] = allHistory[productId].slice(-MAX_HISTORY_ENTRIES);
    }

    localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(allHistory));
  } catch (error) {
    console.error('Error updating price history:', error);
  }
}

export function getPriceTrend(priceHistory: PriceHistory[]): 'up' | 'down' | 'stable' {
  if (priceHistory.length < 2) return 'stable';

  const currentPrice = priceHistory[priceHistory.length - 1].price;
  const previousPrice = priceHistory[priceHistory.length - 2].price;

  const difference = currentPrice - previousPrice;
  const threshold = previousPrice * 0.01; // 1% threshold

  if (Math.abs(difference) < threshold) return 'stable';
  return difference > 0 ? 'up' : 'down';
}

export function addPriceHistoryToProducts(products: SearchResultItem[]): ProductWithHistory[] {
  return products.map(product => {
    const productId = `${product.platform}_${product.title.replace(/\s+/g, '_').toLowerCase()}`;
    const priceHistory = getPriceHistory(productId);
    const priceTrend = getPriceTrend(priceHistory);

    // Update history with current price
    updatePriceHistory(product);

    return {
      ...product,
      priceHistory,
      priceTrend
    };
  });
}

export function getPriceChange(product: ProductWithHistory): { amount: number; percentage: number } | null {
  if (product.priceHistory.length < 2) return null;

  const currentPrice = parseFloat(product.price.replace(/[₹,]/g, ''));
  const previousPrice = product.priceHistory[product.priceHistory.length - 2].price;

  const amount = currentPrice - previousPrice;
  const percentage = (amount / previousPrice) * 100;

  return { amount, percentage };
}