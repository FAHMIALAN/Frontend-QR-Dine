<template>
  <div class="min-h-screen bg-[#F9FAFB] pb-32">
    <!-- Header -->
    <header class="bg-white px-6 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center gap-4">
        <button @click="$router.push('/')" class="p-2 hover:bg-gray-50 rounded-xl transition">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900">Keranjang Saya</h1>
      </div>
      <button v-if="cartState.items.length > 0" @click="cartState.clearCart()" class="text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition">
        Kosongkan
      </button>
    </header>

    <div class="max-w-2xl mx-auto p-6">
      <!-- Empty State -->
      <div v-if="cartState.items.length === 0" class="py-20 text-center">
        <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
        <p class="text-gray-400 text-sm mb-10">Sepertinya Anda belum memilih hidangan apapun.</p>
        <button @click="$router.push('/')" class="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:bg-black transition">
          Cari Makanan
        </button>
      </div>

      <!-- Item List -->
      <div v-else class="space-y-4">
        <div v-for="item in cartState.items" :key="item.id" class="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm">
          <div class="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-50">
            <img :src="item.gambar ? `http://localhost:8080/uploads/menu/${item.gambar}` : 'https://placehold.co/400x400?text=Makanan'" class="w-full h-full object-cover" />
          </div>
          <div class="flex-grow flex flex-col justify-between py-1">
            <div>
              <h3 class="font-bold text-gray-900 leading-tight">{{ item.nama }}</h3>
              <p class="text-primary font-semibold text-sm mt-1">Rp {{ item.harga.toLocaleString('id-ID') }}</p>
            </div>
            <div class="flex justify-between items-center mt-2">
              <p class="text-xs font-medium text-gray-500">Total: Rp {{ (item.qty * item.harga).toLocaleString('id-ID') }}</p>
              
              <!-- Qty Control -->
              <div class="flex items-center bg-gray-50 rounded-lg p-1 gap-3 border border-gray-100">
                <button @click="cartState.removeFromCart(item.id)" class="w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm text-gray-500 hover:text-red-500 transition active:scale-90">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 12H4" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <span class="font-semibold text-gray-900 text-sm min-w-[1ch] text-center">{{ item.qty }}</span>
                <button @click="cartState.addToCart(item)" class="w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm text-primary hover:text-primary-dark transition active:scale-90">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Footer Summary -->
    <div v-if="cartState.items.length > 0" class="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-40">
      <div class="max-w-2xl mx-auto flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-xs font-medium text-gray-500">Total Pesanan</p>
            <p class="text-2xl font-bold text-gray-900 mt-0.5">Rp {{ cartState.totalPrice.toLocaleString('id-ID') }}</p>
          </div>
          <button @click="$router.push('/checkout')" class="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-sm hover:bg-primary-dark transition-all active:scale-95">
            Lanjut Bayar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { cartState } from "../store/cart";
import { useRouter } from "vue-router";

const router = useRouter();
</script>