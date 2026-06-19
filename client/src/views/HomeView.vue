<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const status = ref({ currentPrice: 0, availableTickets: 0, totalCapacity: 0 });
const loading = ref(true);

const fetchStatus = async () => {
  try {
    const { data } = await api.get('/public/status');
    status.value = data;
  } catch (error) {
    console.error('Failed to fetch status', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStatus);

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(cents / 100);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <div class="relative w-full max-w-4xl">
      <!-- Decorative blobs -->
      <div class="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div class="relative z-10 space-y-8">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight">
          The Ultimate <br />
          <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Event Experience</span>
        </h1>
        <p class="text-xl text-neutral-400 max-w-2xl mx-auto">
          Don't miss out on the event of the year. Secure your spot now before prices go up or tickets sell out!
        </p>

        <div v-if="loading" class="flex justify-center mt-12">
          <div class="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <div v-else class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div class="bg-neutral-800/50 backdrop-blur border border-neutral-700/50 p-8 rounded-3xl shadow-xl transition hover:border-indigo-500/50">
            <h3 class="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-2">Current Price</h3>
            <div class="text-5xl font-bold text-white">{{ formatPrice(status.currentPrice) }}</div>
            <p class="text-xs text-neutral-500 mt-4">Price increases as tickets sell</p>
          </div>
          
          <div class="bg-neutral-800/50 backdrop-blur border border-neutral-700/50 p-8 rounded-3xl shadow-xl transition hover:border-cyan-500/50">
            <h3 class="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-2">Available Tickets</h3>
            <div class="text-5xl font-bold" :class="status.availableTickets > 0 ? 'text-white' : 'text-red-400'">
              {{ status.availableTickets }}
              <span class="text-lg text-neutral-500 font-normal">/ {{ status.totalCapacity }}</span>
            </div>
            <p class="text-xs text-neutral-500 mt-4" v-if="status.availableTickets > 0">Hurry, grabbing yours soon!</p>
            <p class="text-xs text-red-400/80 mt-4" v-else>Sold Out</p>
          </div>
        </div>

        <div class="mt-12">
          <router-link to="/buy" class="inline-block bg-white text-black font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300">
            Get Your Ticket Now
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
