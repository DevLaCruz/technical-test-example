import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: localStorage.getItem('token') || null,
    loading: true,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    async fetchMe() {
      if (!this.token) {
        this.loading = false;
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        this.user = data.user;
      } catch (error) {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
      } finally {
        this.loading = false;
      }
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    }
  }
});
