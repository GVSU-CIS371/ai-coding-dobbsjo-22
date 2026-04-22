<script setup lang="ts">
import { onMounted } from 'vue';
import { supabase } from '@/services/supabase';
import { useWatchlistStore } from '@/stores/watchlist';
import { useRouter } from 'vue-router';

const watchlist = useWatchlistStore();
const router = useRouter();

onMounted(async () => {
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // If logged in, fetch their stocks
    await watchlist.fetchWatchlist();
  } else {
    // Optional: redirect to login if not authenticated
    router.push('/auth');
  }

  // Listen for auth changes (login/logout)
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      watchlist.fetchWatchlist();
    } else {
      watchlist.symbols = []; // Clear list on logout
    }
  });
});
</script>

<template>
  <nav class="main-nav">
    <router-link to="/">Dashboard</router-link>
    <router-link to="/auth">Account</router-link>
  </nav>
  <RouterView />
</template>

<style>
.main-nav {
  padding: 1rem;
  display: flex;
  gap: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
</style>