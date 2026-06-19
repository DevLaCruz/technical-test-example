<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const tickets = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await api.get('/tickets/my-tickets');
    tickets.value = data;
  } catch (err) {
    error.value = 'Failed to load your tickets';
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
  <div class="max-w-4xl mx-auto mt-8">
    <h2 class="text-3xl font-bold text-white mb-8">My Tickets</h2>
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
      {{ error }}
    </div>

    <div v-else-if="tickets.length === 0" class="text-center py-20 bg-neutral-800/30 rounded-3xl border border-neutral-700/30">
      <div class="text-6xl mb-4">🎫</div>
      <h3 class="text-xl font-medium text-white mb-2">No tickets yet</h3>
      <p class="text-neutral-400 mb-6">You haven't purchased any tickets for this event.</p>
      <router-link to="/buy" class="text-indigo-400 hover:text-indigo-300 font-medium">Get a ticket now &rarr;</router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link v-for="ticket in tickets" :key="ticket._id" :to="`/ticket/${ticket._id}`"
        class="block bg-neutral-800 border border-neutral-700 hover:border-indigo-500/50 p-6 rounded-2xl transition group relative overflow-hidden">
        <div class="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition"></div>
        
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-xs font-bold tracking-wider uppercase text-indigo-400">General Admission</span>
            <h4 class="text-lg font-bold text-white mt-1">Ticket #{{ ticket.code.substring(0, 8) }}</h4>
          </div>
          <div class="bg-neutral-900 px-3 py-1 rounded-full border border-neutral-700">
            <span class="text-sm font-medium text-white">{{ formatPrice(ticket.pricePaid) }}</span>
          </div>
        </div>
        
        <div class="text-sm text-neutral-400 mt-6 pt-4 border-t border-neutral-700/50">
          Purchased: {{ formatDate(ticket.purchasedAt) }}
        </div>
      </router-link>
    </div>
  </div>
</template>
