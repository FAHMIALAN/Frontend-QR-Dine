<template>
  <div class="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-12 px-4">
    <div class="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
      
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Status Pesanan</h1>
        <p class="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Lacak Pesanan Anda</p>
      </div>

      <div v-if="order" class="space-y-6">
        <div class="bg-gray-50 p-5 rounded-xl border border-gray-100">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kode Pesanan</p>
          <p class="text-2xl font-bold text-gray-900 tracking-tight">{{ order.kode_order }}</p>
        </div>
        
        <div class="flex gap-4">
          <div class="flex-1 bg-gray-50 p-5 rounded-xl border border-gray-100 text-center">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Order</p>
            <p class="text-sm font-bold text-gray-900 uppercase">{{ order.status_order }}</p>
          </div>
          <div class="flex-1 bg-gray-50 p-5 rounded-xl border border-gray-100 text-center">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pembayaran</p>
            <p class="text-sm font-bold uppercase" :class="{
              'text-yellow-600': order.status_pembayaran === 'waiting',
              'text-primary': order.status_pembayaran === 'paid',
              'text-red-500': order.status_pembayaran === 'rejected',
              'text-gray-500': order.status_pembayaran === 'unpaid'
            }">
              {{ order.status_pembayaran === 'waiting' ? 'Menunggu' : 
                 order.status_pembayaran === 'paid' ? 'Lunas' : 
                 order.status_pembayaran === 'rejected' ? 'Ditolak' : 'Belum Bayar' }}
            </p>
          </div>
        </div>

        <!-- Notification Boxes -->
        <div v-if="order.status_pembayaran === 'waiting'" class="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
          <p class="text-xs text-yellow-700 font-medium leading-relaxed text-center">
            Bukti pembayaran Anda sedang diverifikasi. <br>Mohon tunggu sebentar, kami akan segera memproses hidangan Anda.
          </p>
        </div>

        <div v-if="order.status_pembayaran === 'paid'" class="bg-green-50 p-4 rounded-xl border border-green-100">
          <p class="text-xs text-primary font-bold leading-relaxed text-center uppercase tracking-wider">
            Pembayaran Berhasil! <br>Pesanan Anda sedang kami siapkan.
          </p>
        </div>

        <div v-if="order.status_pembayaran === 'rejected'" class="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
          <p class="text-xs text-red-600 font-bold leading-relaxed mb-3">
            Maaf, Bukti Pembayaran Ditolak.
          </p>
          <button @click="goToUpload" class="text-xs bg-white text-red-500 border border-red-100 px-5 py-2.5 rounded-lg font-bold hover:bg-red-50 transition shadow-sm">
            Upload Ulang
          </button>
        </div>
        
        <div v-if="order.status_pembayaran === 'unpaid' && order.metode_pembayaran === 'transfer'" class="pt-4">
          <button @click="goToUpload" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition shadow-sm uppercase tracking-wider text-sm">
            Kirim Bukti Pembayaran
          </button>
        </div>
        
        <div class="pt-6 text-center">
          <button @click="$router.push('/')" class="text-gray-500 font-bold uppercase tracking-wider text-xs hover:text-gray-900 transition underline underline-offset-4">Kembali ke Menu</button>
        </div>
      </div>
      
      <div v-else class="text-center py-20">
        <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-400 font-bold uppercase tracking-wider text-xs">Memuat Data...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";

const route = useRoute();
const router = useRouter();
const order = ref(null);

const getOrder = async () => {
  const id = route.query.order_id;

  if (id) {
    try {
      const res = await api.get(`/orders/${id}`);
      order.value = res.data;
    } catch (error) {
      console.error("Gagal mengambil data pesanan", error);
    }
  }
};

const goToUpload = () => {
  if (order.value && order.value.id) {
    router.push(`/upload-payment?order_id=${order.value.id}`);
  }
};

onMounted(() => {
  getOrder();
});
</script>