<template>
  <div class="min-h-screen bg-[#F9FAFB] pb-32">
    <!-- Header -->
    <header class="bg-white px-6 py-6 border-b border-gray-100 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
      <button @click="$router.back()" class="p-2 hover:bg-gray-50 rounded-xl transition">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <h1 class="text-xl font-bold text-gray-900">Konfirmasi Pesanan</h1>
    </header>

    <div class="max-w-2xl mx-auto p-6 space-y-6">
      <!-- Ringkasan Pesanan Card -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Detail Pesanan</h2>
        <div class="space-y-4">
          <div v-for="item in cartState.items" :key="item.id" class="flex justify-between items-start">
            <div class="flex gap-3">
              <span class="w-6 h-6 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-[10px] font-bold">{{ item.qty }}x</span>
              <span class="text-sm font-medium text-gray-800">{{ item.nama }}</span>
            </div>
            <span class="text-sm font-bold text-gray-900">Rp {{ (item.qty * item.harga).toLocaleString('id-ID') }}</span>
          </div>
          <div class="pt-4 border-t border-gray-50 flex justify-between items-center">
            <span class="text-sm font-medium text-gray-600">Total Pembayaran</span>
            <span class="text-xl font-bold text-primary">Rp {{ cartState.totalPrice.toLocaleString('id-ID') }}</span>
          </div>
        </div>
      </div>  

      <!-- Input Nomor Meja -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Nomor Meja Anda</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <input 
            type="number" 
            v-model="nomorMeja" 
            placeholder="Contoh: 05"
            class="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-6 py-3 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      <!-- Metode Pembayaran Selector -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-1">Pilih Pembayaran</h2>
        <div class="grid grid-cols-1 gap-3">
          <button @click="metode = 'cod'" 
            class="flex items-center p-3 rounded-xl border-2 transition-all"
            :class="metode === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-100'">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-50 mr-4 text-primary shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div class="text-left">
              <p class="font-bold text-sm text-gray-900">Bayar Tunai</p>
              <p class="text-[10px] text-gray-500 font-medium">Bayar di kasir / saat makanan tiba</p>
            </div>
            <div v-if="metode === 'cod'" class="ml-auto text-primary">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            </div>
          </button>

          <button @click="metode = 'transfer'" 
            class="flex items-center p-3 rounded-xl border-2 transition-all"
            :class="metode === 'transfer' ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-100'">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-50 mr-4 text-primary shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div class="text-left">
              <p class="font-bold text-sm text-gray-900">Transfer Bank</p>
              <p class="text-[10px] text-gray-500 font-medium">Transfer ke rekening resmi resto</p>
            </div>
            <div v-if="metode === 'transfer'" class="ml-auto text-primary">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Rekening Info (If Transfer Selected) -->
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
        <div v-if="metode === 'transfer'" class="space-y-3">
          <div v-for="rek in rekening" :key="rek.id" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <p class="text-[10px] font-bold text-primary uppercase tracking-wider">{{ rek.bank }}</p>
              <p class="text-base font-bold text-gray-900 leading-tight mt-0.5">{{ rek.no_rekening }}</p>
              <p class="text-[10px] text-gray-500 font-medium mt-0.5">a.n {{ rek.nama }}</p>
            </div>
            <button @click="copyToClipboard(rek.no_rekening)" class="bg-gray-50 text-gray-400 p-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition active:scale-90">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </transition>

      <!-- Submit Button -->
      <button @click="checkout"
        :disabled="isProcessing || !nomorMeja || cartState.items.length === 0"
        class="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-sm hover:bg-primary-dark transition-all active:scale-95 disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-2 mt-4">
        <span v-if="isProcessing">Memproses...</span>
        <template v-else>
          <span>Pesan Sekarang</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { cartState } from "../store/cart";
import { toast } from "../utils/swal";

const router = useRouter();
const metode = ref("cod");
const nomorMeja = ref("");
const rekening = ref([]);
const isProcessing = ref(false);

const getRekening = async () => {
  try {
    const res = await api.get("/payment/rekening");
    rekening.value = res.data;
  } catch (error) {
    console.error("Gagal memuat rekening:", error);
  }
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    toast("Nomor rekening berhasil disalin!", "success");
  });
};

const checkout = async () => {
  if (!nomorMeja.value) {
    toast("Mohon isi nomor meja Anda!", "error");
    return;
  }

  isProcessing.value = true;
  try {
    const payload = {
      nomor_meja: parseInt(nomorMeja.value),
      total: cartState.totalPrice,
      metode: metode.value,
      items: cartState.items.map(item => ({
        id: item.id,
        qty: item.qty,
        harga: item.harga
      }))
    };

    const res = await api.post("/orders", payload);
    const orderId = res.data.order_id;
    
    cartState.clearCart();
    toast("Pesanan Berhasil Dibuat!", "success");

    if (metode.value === "transfer") {
      router.push(`/upload-payment?order_id=${orderId}`);
    } else {
      router.push(`/status?order_id=${orderId}`);
    }
  } catch (error) {
    toast("Gagal memproses pesanan.", "error");
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  if (cartState.items.length === 0) {
    router.push('/');
  } else {
    getRekening();
  }
});
</script>