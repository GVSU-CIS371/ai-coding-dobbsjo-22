<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/services/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const isSignUp = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const handleAuth = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    if (isSignUp.value) {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      alert('Check your email for a confirmation link!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      router.push('/'); // Redirect to home after login
    }
  } catch (err: any) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ isSignUp ? 'Create Account' : 'Welcome Back' }}</h2>
      <p class="subtitle">{{ isSignUp ? 'Sign up to start tracking stocks' : 'Login to view your watchlist' }}</p>

      <form @submit.prevent="handleAuth">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="you@example.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login') }}
        </button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <div class="toggle-mode">
        <span>{{ isSignUp ? 'Already have an account?' : 'Need an account?' }}</span>
        <button @click="isSignUp = !isSignUp" class="btn-link">
          {{ isSignUp ? 'Login' : 'Sign Up' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.subtitle {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
  text-align: left;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-sizing: border-box;
}

button[type="submit"] {
  width: 100%;
  padding: 0.75rem;
  background: #42b883;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.toggle-mode {
  margin-top: 1.5rem;
  font-size: 0.875rem;
}

.btn-link {
  background: none;
  border: none;
  color: #42b883;
  font-weight: 700;
  cursor: pointer;
  margin-left: 5px;
  text-decoration: underline;
}
</style>