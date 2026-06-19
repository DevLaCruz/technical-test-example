<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    });
    authStore.setToken(data.token);
    await authStore.fetchMe();
    router.push('/');
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-16 p-8 bg-neutral-800/80 backdrop-blur border border-neutral-700/50 rounded-2xl shadow-xl">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-white">Welcome back</h2>
      <p class="text-neutral-400 mt-2">Sign in to your account</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
        {{ error }}
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-2">Email</label>
        <input v-model="email" type="email" required
          class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          placeholder="you@example.com" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-2">Password</label>
        <input v-model="password" type="password" required
          class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          placeholder="••••••••" />
      </div>
      
      <button type="submit" :disabled="loading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 disabled:opacity-50">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
    
    <p class="text-center text-neutral-400 mt-6 text-sm">
      Don't have an account? 
      <router-link to="/register" class="text-indigo-400 hover:text-indigo-300">Sign up</router-link>
    </p>
  </div>
</template>
