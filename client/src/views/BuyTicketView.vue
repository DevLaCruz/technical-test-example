<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const status = ref({ currentPrice: 0, availableTickets: 0 });
const loading = ref(true);
const purchasing = ref(false);
const error = ref('');
const router = useRouter();

onMounted(async () => {
  try {
    const { data } = await api.get('/public/status');
    status.value = data;
  } catch (err) {
    error.value = 'Failed to load ticket status';
  } finally {
    loading.value = false;
  }
});

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(cents / 100);
};

const handleBuy = async () => {
  purchasing.value = true;
  error.value = '';
  try {
    const { data } = await api.post('/tickets/buy');
    router.push(`/ticket/${data.ticket._id}`);
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to purchase ticket';
  } finally {
    purchasing.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto mt-12 p-8 bg-neutral-800/80 backdrop-blur border border-neutral-700/50 rounded-3xl shadow-2xl">
    <div class="text-center mb-10">
      <h2 class="text-4xl font-extrabold text-white tracking-tight">Checkout</h2>
      <p class="text-neutral-400 mt-2">Secure your entrance</p>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div v-else class="space-y-8">
      <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
        {{ error }}
      </div>

      <div class="bg-neutral-900 rounded-2xl p-6 border border-neutral-700 flex justify-between items-center">
        <div>
          <h3 class="text-xl font-bold text-white">General Admission</h3>
          <p class="text-neutral-500 text-sm mt-1">1x Ticket</p>
        </div>
        <div class="text-3xl font-bold text-indigo-400">
          {{ formatPrice(status.currentPrice) }}
        </div>
      </div>

      <div class="border-t border-neutral-700 pt-6 space-y-4">
        <div class="flex justify-between text-neutral-400">
          <span>Subtotal</span>
          <span>{{ formatPrice(status.currentPrice) }}</span>
        </div>
        <div class="flex justify-between text-white text-xl font-bold">
          <span>Total</span>
          <span>{{ formatPrice(status.currentPrice) }}</span>
        </div>
      </div>

      <button @click="handleBuy" :disabled="purchasing || status.availableTickets <= 0"
        class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 text-lg flex justify-center items-center">
        <span v-if="purchasing" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
        {{ purchasing ? 'Processing...' : (status.availableTickets > 0 ? 'Pay Now' : 'Sold Out') }}
      </button>
    </div>
  </div>
</template>
