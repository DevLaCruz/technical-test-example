<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const stats = ref({ totalSold: 0, totalEarnings: 0 });
const config = ref({ totalCapacity: 0, basePrice: 0, incrementPerTicket: 0 });
const sales = ref<any[]>([]);
const searchResults = ref<any[]>([]);
const searchQuery = ref('');
const loading = ref(true);
const configSaving = ref(false);

const salesPage = ref(1);
const salesTotalPages = ref(1);
const searchPage = ref(1);
const searchTotalPages = ref(1);

const fetchData = async () => {
  try {
    const [statsRes, configRes, salesRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/config'),
      api.get(`/admin/sales?page=${salesPage.value}`)
    ]);
    stats.value = statsRes.data;
    config.value = configRes.data;
    sales.value = salesRes.data.sales;
    salesTotalPages.value = salesRes.data.totalPages;
  } catch (error) {
    console.error('Failed to load admin data', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const handleSearch = async () => {
  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }
  try {
    const { data } = await api.get(`/admin/users/search?q=${searchQuery.value}&page=${searchPage.value}`);
    searchResults.value = data.users;
    searchTotalPages.value = data.totalPages;
  } catch (error) {
    console.error('Search failed', error);
  }
};

const saveConfig = async () => {
  configSaving.value = true;
  try {
    await api.put('/admin/config', config.value);
    alert('Configuración guardada exitosamente');
  } catch (error) {
    alert('Error al guardar configuración');
  } finally {
    configSaving.value = false;
  }
};

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(cents / 100);
};

const changeSalesPage = async (page: number) => {
  if (page >= 1 && page <= salesTotalPages.value) {
    salesPage.value = page;
    const { data } = await api.get(`/admin/sales?page=${page}`);
    sales.value = data.sales;
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-bold text-white">Admin Dashboard</h2>
    </div>
    
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div v-else class="space-y-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-neutral-800/80 border border-neutral-700/50 p-6 rounded-2xl shadow-lg">
          <div class="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Tickets Sold</div>
          <div class="text-4xl font-bold text-white">{{ stats.totalSold }}</div>
        </div>
        <div class="bg-neutral-800/80 border border-neutral-700/50 p-6 rounded-2xl shadow-lg">
          <div class="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Earnings</div>
          <div class="text-4xl font-bold text-emerald-400">{{ formatPrice(stats.totalEarnings) }}</div>
        </div>
      </div>

      <!-- Config & User Search -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Configuration -->
        <div class="bg-neutral-800/80 border border-neutral-700/50 p-6 rounded-2xl shadow-lg">
          <h3 class="text-xl font-bold text-white mb-6">Event Configuration</h3>
          <form @submit.prevent="saveConfig" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1">Total Capacity</label>
              <input v-model="config.totalCapacity" type="number" required
                class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1">Base Price (cents)</label>
              <input v-model="config.basePrice" type="number" required
                class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-300 mb-1">Increment Per Ticket (cents)</label>
              <input v-model="config.incrementPerTicket" type="number" required
                class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <button type="submit" :disabled="configSaving"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition mt-4 disabled:opacity-50">
              {{ configSaving ? 'Saving...' : 'Save Configuration' }}
            </button>
          </form>
        </div>

        <!-- User Search -->
        <div class="bg-neutral-800/80 border border-neutral-700/50 p-6 rounded-2xl shadow-lg">
          <h3 class="text-xl font-bold text-white mb-6">User Search</h3>
          <form @submit.prevent="handleSearch" class="flex gap-2 mb-6">
            <input v-model="searchQuery" type="text" placeholder="Search by name or DNI..."
              class="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition" />
            <button type="submit" class="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-xl transition">Search</button>
          </form>
          
          <div class="space-y-3">
            <div v-for="user in searchResults" :key="user._id" class="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
              <div class="font-bold text-white">{{ user.firstName }} {{ user.lastName }}</div>
              <div class="text-sm text-neutral-400">DNI: {{ user.dni }} | Email: {{ user.email }}</div>
            </div>
            <div v-if="searchResults.length === 0 && searchQuery" class="text-neutral-500 text-center py-4">No users found.</div>
          </div>
        </div>
      </div>

      <!-- Sales List -->
      <div class="bg-neutral-800/80 border border-neutral-700/50 rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-neutral-700/50">
          <h3 class="text-xl font-bold text-white">Recent Sales</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-neutral-400">
            <thead class="bg-neutral-900/50 text-xs uppercase text-neutral-500">
              <tr>
                <th class="px-6 py-4 font-medium">Buyer</th>
                <th class="px-6 py-4 font-medium">Ticket ID</th>
                <th class="px-6 py-4 font-medium">Price Paid</th>
                <th class="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800">
              <tr v-for="sale in sales" :key="sale._id" class="hover:bg-neutral-800/50 transition">
                <td class="px-6 py-4">
                  <div class="text-white font-medium">{{ sale.user.firstName }} {{ sale.user.lastName }}</div>
                  <div class="text-xs">DNI: {{ sale.user.dni }}</div>
                </td>
                <td class="px-6 py-4 font-mono text-xs">{{ sale.code.substring(0, 8) }}...</td>
                <td class="px-6 py-4 font-medium text-emerald-400">{{ formatPrice(sale.pricePaid) }}</td>
                <td class="px-6 py-4">{{ new Date(sale.purchasedAt).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="p-4 border-t border-neutral-700/50 flex justify-between items-center bg-neutral-900/30">
          <button @click="changeSalesPage(salesPage - 1)" :disabled="salesPage <= 1" class="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg disabled:opacity-50 hover:bg-neutral-700 transition text-sm">Previous</button>
          <span class="text-neutral-400 text-sm">Page {{ salesPage }} of {{ salesTotalPages }}</span>
          <button @click="changeSalesPage(salesPage + 1)" :disabled="salesPage >= salesTotalPages" class="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg disabled:opacity-50 hover:bg-neutral-700 transition text-sm">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>
