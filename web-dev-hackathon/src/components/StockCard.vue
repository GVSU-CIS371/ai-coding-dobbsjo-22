<script setup lang="ts">
import { onMounted } from 'vue';
import { useStock } from '@/composables/useStock';
import { useWatchlistStore } from '@/stores/watchlist';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-vue-next';

const props = defineProps<{
  symbol: string;
}>();

const watchlist = useWatchlistStore();
const { stockData, loading, error, fetchQuote } = useStock();

// Fetch data when the card is created
onMounted(() => {
  fetchQuote(props.symbol);
});

// Helper to determine price color
const getPriceClass = (change: number) => {
  if (change > 0) return 'text-success';
  if (change < 0) return 'text-danger';
  return '';
};
</script>

<template>
  <div class="stock-card">
    <div class="card-content">
      <div class="header">
        <span class="symbol">{{ symbol }}</span>
        <button @click="watchlist.removeStock(symbol)" class="delete-btn" title="Remove">
          <Trash2 :size="18" />
        </button>
      </div>

      <div v-if="loading" class="loader">
        <div class="spinner"></div>
      </div>

      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>

      <div v-else-if="stockData" class="data-display">
        <div class="price-row">
          <span class="current-price">${{ stockData.price.toFixed(2) }}</span>
          <div :class="['change-badge', getPriceClass(stockData.change)]">
            <component :is="stockData.change >= 0 ? TrendingUp : TrendingDown" :size="14" />
            {{ stockData.percentChange.toFixed(2) }}%
          </div>
        </div>
        
        <div class="details">
          <span>Low: ${{ stockData.low.toFixed(2) }}</span>
          <span>High: ${{ stockData.high.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stock-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.symbol {
  font-weight: 800;
  font-size: 1.2rem;
  color: #1e293b;
}

.delete-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.delete-btn:hover {
  color: #ef4444;
  background: #fee2e2;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.5rem;
  font-weight: 700;
}

.change-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
}

.text-success { background: #dcfce7; color: #15803d; }
.text-danger { background: #fee2e2; color: #b91c1c; }

.details {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
  border-top: 1px solid #f1f5f9;
  padding-top: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>