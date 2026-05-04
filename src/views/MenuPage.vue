<template>
  <div class="min-h-screen bg-gray-50 pb-32">
    <!-- Header Modern Minimalis -->
    <header class="bg-white px-6 py-6 border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="w-full flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">QR <span class="text-primary">DINE</span></h1>
            <p class="text-xs font-medium text-gray-500 mt-0.5">Pesan di Meja, Lebih Praktis</p>
          </div>
          <div class="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary md:hidden">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
        </div>
        
        <!-- Search Bar -->
        <div class="w-full md:w-auto relative flex-shrink-0">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari makanan atau minuman..." 
            class="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
          <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>
    </header>

    <!-- Dynamic Promo Banners -->
    <div class="px-6 py-6 max-w-4xl mx-auto" v-if="promos.length > 0">
      <div class="flex gap-4 overflow-x-auto no-scrollbar snap-x py-2 -mx-6 px-6 md:mx-0 md:px-0">
        <div v-for="promo in promos" :key="promo.id" class="snap-center shrink-0 w-[85%] md:w-full max-w-[400px] md:max-w-none relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
          <img v-if="promo.image" :src="`http://localhost:8080/uploads/promos/${promo.image}`" class="w-full h-32 md:h-40 object-cover" />
          <div v-else class="w-full h-32 md:h-40 bg-gradient-to-br from-primary to-primary-dark"></div>
          
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
            <h2 class="text-lg font-bold text-white mb-1">{{ promo.title }}</h2>
            <p class="text-xs text-white/80 font-medium line-clamp-1">{{ promo.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="px-6 mb-8 max-w-4xl mx-auto flex gap-3 overflow-x-auto no-scrollbar py-2">
      <button 
        v-for="cat in ['semua', 'makanan', 'minuman']" 
        :key="cat"
        @click="selectedCategory = cat"
        class="px-6 py-2.5 rounded-xl font-semibold text-xs capitalize tracking-wide transition-all duration-300 border shrink-0"
        :class="selectedCategory === cat 
          ? 'bg-gray-900 text-white border-gray-900' 
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Menu Grid -->
    <div class="px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in filteredMenu"
        :key="item.id"
        class="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative group"
      >
        <!-- Food Image -->
        <div class="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-50 shrink-0">
          <img
            :src="item.gambar ? `http://localhost:8080/uploads/menu/${item.gambar}` : 'https://placehold.co/600x400?text=Menu'"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            alt="Food"
          />
        </div>

        <!-- Food Info -->
        <div class="flex flex-col justify-between py-1 flex-grow">
          <div>
            <div class="flex justify-between items-start">
              <h3 class="text-base font-bold text-gray-900 leading-tight">{{ item.nama }}</h3>
            </div>
            <p class="text-xs font-medium text-gray-400 capitalize mt-1">{{ item.kategori }}</p>
            <p class="text-primary font-bold text-sm mt-2">Rp {{ Number(item.harga).toLocaleString('id-ID') }}</p>
          </div>
          
          <div class="flex justify-between items-center mt-3">
             <!-- Status Badge -->
             <span v-if="item.status_menu === 'habis'" class="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-1 rounded-md">Habis</span>
             <span v-else class="text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-1 rounded-md">Tersedia</span>

             <!-- Add Button -->
             <button
               :disabled="item.status_menu === 'habis'"
               @click="cartState.addToCart(item)"
               class="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95 disabled:bg-gray-50 disabled:text-gray-300"
             >
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2" stroke-linecap="round"/></svg>
             </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMenu.length === 0" class="col-span-full py-16 text-center">
        <p class="text-gray-400 font-medium">Maaf, menu untuk kategori ini belum tersedia.</p>
      </div>
    </div>

    <!-- Floating Checkout Button -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="transform translate-y-20 opacity-0" enter-to-class="transform translate-y-0 opacity-100">
      <div v-if="cartState.totalItems > 0" class="fixed bottom-6 left-6 right-6 z-50">
        <button @click="$router.push('/cart')" class="w-full max-w-lg mx-auto bg-gray-900 text-white py-4 px-6 rounded-2xl flex justify-between items-center shadow-xl hover:bg-black transition-all active:scale-95">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              {{ cartState.totalItems }}
            </div>
            <span class="font-medium">Lihat Keranjang</span>
          </div>
          <p class="font-bold">Rp {{ cartState.totalPrice.toLocaleString('id-ID') }}</p>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import { cartState } from "../store/cart";
import { useRouter } from "vue-router";

const router = useRouter();
const menu = ref([]);
const promos = ref([]);
const selectedCategory = ref("semua");
const searchQuery = ref("");

const filteredMenu = computed(() => {
  let result = menu.value;
  
  if (selectedCategory.value !== "semua") {
    result = result.filter(item => item.kategori.toLowerCase() === selectedCategory.value);
  }
  
  if (searchQuery.value.trim() !== "") {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(item => item.nama.toLowerCase().includes(q));
  }
  
  return result;
});

const getMenu = async () => {
  try {
    const res = await api.get("/menu");
    menu.value = res.data.data;
  } catch (error) {
    console.error("Gagal mengambil menu:", error);
  }
};

const getPromos = async () => {
  try {
    const res = await api.get("/promos/active");
    promos.value = res.data.data;
  } catch (error) {
    console.error("Gagal mengambil promo:", error);
  }
};

onMounted(() => {
  getMenu();
  getPromos();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
