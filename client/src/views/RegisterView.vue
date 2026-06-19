<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const dni = ref('');
const email = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await api.post('/auth/register', {
      dni: dni.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value
    });
    router.push('/login');
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-16 p-8 bg-neutral-800/80 backdrop-blur border border-neutral-700/50 rounded-2xl shadow-xl">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-white">Create Account</h2>
      <p class="text-neutral-400 mt-2">Join us to get your tickets</p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-1">DNI</label>
        <input v-model="dni" type="text" required
          class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-neutral-300 mb-1">First Name</label>
          <input v-model="firstName" type="text" required
            class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-300 mb-1">Last Name</label>
          <input v-model="lastName" type="text" required
            class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-1">Email</label>
        <input v-model="email" type="email" required
          class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-1">Password</label>
        <input v-model="password" type="password" required minlength="6"
          class="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
      </div>
      
      <button type="submit" :disabled="loading"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 mt-4">
        {{ loading ? 'Creating...' : 'Sign Up' }}
      </button>
    </form>
    
    <p class="text-center text-neutral-400 mt-6 text-sm">
      Already have an account? 
      <router-link to="/login" class="text-indigo-400 hover:text-indigo-300">Sign in</router-link>
    </p>
  </div>
</template>
