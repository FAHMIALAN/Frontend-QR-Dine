<template>
  <div class="min-h-screen bg-[#F9FAFB] p-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Atur Rekening Pembayaran</h1>
        <p class="text-sm font-medium text-gray-600 mt-1">Kelola rincian rekening bank untuk menerima transfer dari pelanggan.</p>
      </div>

      <div class="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <!-- Decoration SVG -->
        <div class="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <svg class="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>

        <h2 class="text-lg font-bold text-gray-900 mb-10 flex items-center gap-3 relative z-10">
          <div class="w-2 h-6 bg-primary rounded-full"></div>
          Informasi Rekening Utama
        </h2>

        <form @submit.prevent="savePaymentConfig" class="space-y-8 relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 ml-1">Nama Bank</label>
              <input 
                v-model="payConfig.bank" 
                type="text" 
                placeholder="Contoh: BCA / Mandiri / BNI" 
                class="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                required 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 ml-1">Nomor Rekening</label>
              <input 
                v-model="payConfig.no_rekening" 
                type="text" 
                placeholder="Masukkan nomor rekening" 
                class="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 font-bold text-xl tracking-tight focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                required 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 ml-1">Nama Pemilik Rekening</label>
            <input 
              v-model="payConfig.nama" 
              type="text" 
              placeholder="Sesuai nama di buku tabungan" 
              class="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
              required 
            />
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3 px-1">Pastikan nama sudah benar agar tidak membingungkan pelanggan.</p>
          </div>

          <div class="pt-8 border-t border-gray-50">
            <button 
              type="submit" 
              :disabled="isSaving" 
              class="group relative flex items-center justify-center gap-3 w-full md:w-auto md:px-16 bg-primary text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-dark transition-all active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none uppercase tracking-widest"
            >
              <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>{{ isSaving ? 'Sedang Menyimpan...' : 'Simpan Pengaturan' }}</span>
              <svg v-if="!isSaving" class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { toast } from "../../utils/swal";

const payConfig = ref({
  bank: "",
  no_rekening: "",
  nama: ""
});
const isSaving = ref(false);

const getPaymentConfig = async () => {
  try {
    const res = await api.get("/payment/rekening");
    if (res.data.length > 0) {
      payConfig.value = res.data[0];
    }
  } catch (error) {
    console.error("Gagal mengambil config pembayaran", error);
  }
};

const savePaymentConfig = async () => {
  isSaving.value = true;
  try {
    const data = {
      bank: payConfig.value.bank,
      no_rekening: payConfig.value.no_rekening,
      nama: payConfig.value.nama
    };

    await api.post("/dashboard/payment-config", data);
    toast("Pengaturan rekening berhasil disimpan!", "success");
    getPaymentConfig();
  } catch (error) {
    toast("Gagal menyimpan pengaturan.", "error");
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  getPaymentConfig();
});
</script>
