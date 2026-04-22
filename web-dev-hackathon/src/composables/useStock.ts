import type { StockQuote } from '@/types/stock';
import { ref } from 'vue';

export function useStock() {
  const stockData = ref<StockQuote | null>(null);  const loading = ref(false);
  const error = ref(null);

  const fetchQuote = async (symbol: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/stock?symbol=${symbol.toUpperCase()}`);
      if (!response.ok) throw new Error('Stock not found');
      stockData.value = await response.json();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { stockData, loading, error, fetchQuote };
}