<template>
  <div class="w-72 bg-white text-gray-600 min-h-screen p-6 flex flex-col shadow-sm border-r border-gray-100 relative z-50">
    <!-- Header Admin Modern -->
    <div class="mb-12 px-2">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">QD</div>
        <div>
          <h1 class="text-xl font-extrabold text-gray-900 tracking-tight leading-none">QR DINE</h1>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <ul class="space-y-3 flex-grow">
      <li v-for="item in menuItems" :key="item.id">
        <button 
          @click="$emit('change', item.id)" 
          class="w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 group relative overflow-hidden font-extrabold text-sm outline-none"
          :class="activeTab === item.id ? 'bg-primary/20 text-primary shadow-md shadow-primary/10 ring-1 ring-primary/20' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'"
        >
          <div :class="activeTab === item.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-900 transition duration-300'">
            <component :is="item.icon" class="w-5 h-5" />
          </div>
          <span>{{ item.label }}</span>
          
          <!-- Active Vertical Line Indicator -->
          <div v-if="activeTab === item.id" class="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-7 bg-primary rounded-r-full shadow-[3px_0_15px_rgba(22,163,74,0.4)]"></div>
        </button>
      </li>
    </ul>

    <!-- Logout -->
    <div class="mt-auto pt-6 border-t border-gray-50">
      <button @click="logout" class="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-sm group">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="2" stroke-linecap="round"/></svg>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  CreditCard, 
  Settings2,
  Image
} from 'lucide-vue-next';
import api from '../services/api';

const props = defineProps({
  activeTab: {
    type: String,
    default: 'dashboard'
  }
});

defineEmits(['change']);

const router = useRouter();

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'menu', label: 'Daftar Menu', icon: UtensilsCrossed },
  { id: 'orders', label: 'Pesanan Masuk', icon: ClipboardList },
  { id: 'payment', label: 'Pembayaran', icon: CreditCard },
  { id: 'promos', label: 'Kelola Promo', icon: Image },
  { id: 'rekening', label: 'Atur Rekening', icon: Settings2 },
];

const logout = async () => {
  try {
    // await api.post('/logout');
  } catch (e) {
    console.error("Logout failed");
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  }
};
</script>