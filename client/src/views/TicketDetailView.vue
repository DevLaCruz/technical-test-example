<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';

const route = useRoute();
const ticket = ref<any>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await api.get(`/tickets/${route.params.id}`);
    ticket.value = data;
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Ticket not found or unauthorized';
  } finally {
    loading.value = false;
  }
});

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(cents / 100);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
</script>

<template>
  <div class="max-w-2xl mx-auto mt-12">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-2xl text-center shadow-lg">
      <div class="text-4xl mb-4">🚫</div>
      <h2 class="text-xl font-bold mb-2">Access Denied</h2>
      <p>{{ error }}</p>
      <router-link to="/my-tickets" class="inline-block mt-6 text-indigo-400 hover:text-indigo-300 font-medium">Return to my tickets</router-link>
    </div>
    
    <div v-else class="bg-neutral-800/80 backdrop-blur border border-neutral-700/50 rounded-3xl shadow-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
        <span class="bg-black/20 text-white/90 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">Event Ticket</span>
        <h2 class="text-4xl font-extrabold text-white mt-4 tracking-tight">The Event</h2>
      </div>
      
      <div class="p-8">
        <div class="flex flex-col items-center justify-center mb-10 pb-10 border-b border-neutral-700/50 border-dashed">
          <div class="bg-white p-4 rounded-xl shadow-inner mb-4">
            <!-- Simulated QR code using CSS blocks for aesthetic -->
            <div class="grid grid-cols-4 gap-1 w-32 h-32">
              <div v-for="i in 16" :key="i" class="bg-black rounded-sm" :style="{ opacity: Math.random() > 0.3 ? 1 : 0 }"></div>
            </div>
          </div>
          <div class="text-neutral-400 font-mono text-sm tracking-widest uppercase">{{ ticket.code }}</div>
        </div>

        <div class="grid grid-cols-2 gap-y-8 gap-x-4">
          <div>
            <div class="text-neutral-500 text-xs uppercase tracking-wider font-bold mb-1">Attendee</div>
            <div class="text-white font-medium text-lg">{{ ticket.user.firstName }} {{ ticket.user.lastName }}</div>
          </div>
          <div>
            <div class="text-neutral-500 text-xs uppercase tracking-wider font-bold mb-1">DNI</div>
            <div class="text-white font-medium text-lg">{{ ticket.user.dni }}</div>
          </div>
          <div>
            <div class="text-neutral-500 text-xs uppercase tracking-wider font-bold mb-1">Purchased</div>
            <div class="text-white font-medium">{{ formatDate(ticket.purchasedAt) }}</div>
          </div>
          <div>
            <div class="text-neutral-500 text-xs uppercase tracking-wider font-bold mb-1">Price Paid</div>
            <div class="text-indigo-400 font-bold text-xl">{{ formatPrice(ticket.pricePaid) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
