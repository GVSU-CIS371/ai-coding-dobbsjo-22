export interface StockQuote {
  symbol: string;
  price: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  change: number;
  percentChange: number;
}