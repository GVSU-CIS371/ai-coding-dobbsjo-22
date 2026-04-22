import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/services/supabase';

export const useWatchlistStore = defineStore('watchlist', () => {
  const symbols = ref<string[]>([]);
  const loading = ref(false);

  // 1. Fetch from Supabase
  const fetchWatchlist = async () => {
    loading.value = true;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('watchlists')
        .select('symbol')
        .eq('user_id', user.id);

      if (!error && data) {
        symbols.value = data.map(item => item.symbol);
      }
    }
    loading.value = false;
  };

  // 2. Add to Supabase
  const addStock = async (symbol: string) => {
    const cleanSymbol = symbol.toUpperCase().trim();
    if (!symbols.value.includes(cleanSymbol)) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('watchlists')
          .insert({ symbol: cleanSymbol, user_id: user.id });

        if (!error) symbols.value.push(cleanSymbol);
      } else {
        // Fallback for guest mode if you want to allow it
        symbols.value.push(cleanSymbol);
      }
    }
  };

  // 3. Remove from Supabase
  const removeStock = async (symbol: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase
        .from('watchlists')
        .delete()
        .eq('symbol', symbol)
        .eq('user_id', user.id);
    }
    symbols.value = symbols.value.filter(s => s !== symbol);
  };

  return { symbols, loading, fetchWatchlist, addStock, removeStock };
});