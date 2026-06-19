<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.fetchMe();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-indigo-500/30">
    <nav class="sticky top-0 z-50 backdrop-blur-md bg-neutral-900/80 border-b border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex-shrink-0 text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              🎟️ EventTix
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</router-link>
            
            <template v-if="authStore.isAuthenticated">
              <router-link to="/buy" class="text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Buy Ticket</router-link>
              <router-link to="/my-tickets" class="text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">My Tickets</router-link>
              <router-link v-if="authStore.isAdmin" to="/admin" class="text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin Panel</router-link>
              <button @click="handleLogout" class="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">Logout</button>
            </template>
            <template v-else>
              <router-link to="/login" class="text-neutral-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</router-link>
              <router-link to="/register" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">Register</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
