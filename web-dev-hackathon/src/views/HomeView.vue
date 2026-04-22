<script setup lang="ts">
import { ref } from 'vue';
import { useWatchlistStore } from '@/stores/watchlist';
import { useStock } from '@/composables/useStock';
import StockCard from '@/components/StockCard.vue';

// Initialize the store
const watchlist = useWatchlistStore();
const { fetchQuote, stockData, loading, error } = useStock();

// Local state for the search input
const searchSymbol = ref('');

const handleAddStock = async () => {
  const symbol = searchSymbol.value.toUpperCase().trim();
  
  if (!symbol) return;
  
  // 1. Verify the stock exists by fetching a quote
  await fetchQuote(symbol);
  
  // 2. If valid and no error, add it to the Pinia watchlist
  if (!error.value && stockData.value) {
    watchlist.addStock(symbol);
    searchSymbol.value = ''; // Clear input
  }
};
</script>

<template>
  <main class="container">
    <h1>Stock Tracker</h1>

    <section class="search-section">
      <div class="input-group">
        <input 
          v-model="searchSymbol" 
          type="text" 
          placeholder="Enter ticker (e.g. AAPL)"
          @keyup.enter="handleAddStock"
        />
        <button @click="handleAddStock" :disabled="loading">
          {{ loading ? 'Checking...' : 'Add to Watchlist' }}
        </button>
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
    </section>

    <section class="watchlist-grid">
        <div v-if="watchlist.symbols.length === 0" class="empty-state">
            Your watchlist is empty. Search for a stock to get started!
        </div>

        <StockCard 
            v-for="symbol in watchlist.symbols" 
            :key="symbol" 
            :symbol="symbol" 
        />
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

.search-section {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 12px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #a8dadc;
}

.error-text {
  color: #e63946;
  margin-top: 8px;
}

.watchlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.stock-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-remove {
  background: none;
  color: #888;
  font-size: 1.5rem;
  padding: 0;
  width: auto;
}

.btn-remove:hover {
  color: #e63946;
}

.status-msg {
  font-size: 0.8rem;
  color: #666;
}
</style>