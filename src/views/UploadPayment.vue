<template>
  <div class="min-h-screen bg-warm/20 flex flex-col items-center py-12 px-4">
    <div class="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
      <div class="w-20 h-20 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight mb-2">Bukti Pembayaran</h1>
      <p class="text-gray-500 text-sm font-medium mb-10 leading-relaxed">
        Silakan unggah foto struk atau tangkapan layar bukti transfer Anda.
      </p>

      <div class="mb-10 text-left">
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pilih File Bukti</label>
        <div class="relative group">
          <input 
            type="file" 
            @change="handleFile" 
            accept="image/*"
            class="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark transition cursor-pointer border-2 border-dashed border-gray-200 p-4 rounded-xl bg-gray-50" 
          />
        </div>
      </div>

      <button 
        @click="upload"
        :disabled="!file || isLoading"
        class="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-200 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm uppercase tracking-wider text-sm active:scale-95"
      >
        <div v-if="isLoading" class="flex items-center justify-center gap-3">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Mengunggah...
        </div>
        <span v-else>Kirim Bukti Pembayaran</span>
      </button>

      <button @click="$router.back()" class="mt-6 text-gray-400 font-bold uppercase text-[10px] tracking-wider hover:text-gray-700 transition">Batal & Kembali</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import { toast } from "../utils/swal";

const route = useRoute();
const router = useRouter();

const file = ref(null);
const isLoading = ref(false);

const handleFile = (e) => {
  file.value = e.target.files[0];
};

const upload = async () => {
  if (!file.value) return;
  
  const orderId = route.query.order_id;
  if (!orderId) {
    toast("ID Pesanan tidak ditemukan!", "error");
    return;
  }

  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("bukti", file.value);

    await api.post("/payment/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    
    toast("Bukti pembayaran berhasil terkirim!");
    router.push(`/status?order_id=${orderId}`);
  } catch (error) {
    toast("Gagal mengunggah bukti pembayaran.", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>