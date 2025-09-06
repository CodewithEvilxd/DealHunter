export interface SearchResultItem {
  title: string;
  price: string;
  image: string;
  link: string;
  quantity?: string;
  rating?: string;
  platform: 'Amazon' | 'Flipkart' | 'Swiggy' | 'Zepto' | 'Blinkit';
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface ProductWithHistory extends SearchResultItem {
  priceHistory: PriceHistory[];
  priceTrend: 'up' | 'down' | 'stable';
}
