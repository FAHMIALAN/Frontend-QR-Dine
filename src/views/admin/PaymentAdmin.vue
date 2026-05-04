<template>
  <div class="min-h-screen bg-[#F9FAFB] p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Verifikasi Pembayaran</h1>
          <p class="text-sm font-medium text-gray-600 mt-1">Daftar konfirmasi bukti transfer dari pelanggan.</p>
        </div>
        <button @click="getOrders" class="w-full md:w-auto p-3.5 bg-white text-primary border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm active:scale-95 flex justify-center items-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <!-- List View (Table) -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left min-w-[700px]">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Pesanan</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Bukti Transfer</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50/30 transition-all group">
                <td class="p-4 md:p-6">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kode</p>
                  <h3 class="font-bold text-gray-900 tracking-tight text-lg">#{{ order.kode_order || order.id }}</h3>
                </td>
                
                <td class="p-4 md:p-6">
                  <div v-if="order.bukti_pembayaran" class="flex items-center gap-3 md:gap-4">
                    <!-- Button to Open Modal -->
                    <button @click="showBukti(order.bukti_pembayaran)" class="block w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:scale-105 transition hover:ring-2 hover:ring-primary/20 shrink-0">
                      <img :src="`http://localhost:8080/uploads/payment/${order.bukti_pembayaran}`" class="w-full h-full object-cover" />
                    </button>
                    <span class="text-[10px] font-medium text-gray-400 uppercase italic">Klik untuk zoom</span>
                  </div>
                  <span v-else class="text-xs font-bold text-gray-300 italic">Belum upload bukti</span>
                </td>

                <td class="p-4 md:p-6 text-center">
                  <span class="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    :class="{
                      'bg-yellow-50 text-yellow-600': order.status_pembayaran === 'waiting',
                      'bg-green-50 text-primary': order.status_pembayaran === 'paid',
                      'bg-red-50 text-red-500': order.status_pembayaran === 'rejected'
                    }">
                    {{ order.status_pembayaran }}
                  </span>
                </td>

                <td class="p-4 md:p-6 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="verify(order.id, 'paid')" 
                      :disabled="order.status_pembayaran === 'paid' || !order.bukti_pembayaran"
                      class="px-4 py-2 md:px-6 md:py-3 bg-primary text-white rounded-xl font-bold text-xs shadow-sm hover:bg-primary-dark transition active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none">
                      Approve
                    </button>
                    <button @click="verify(order.id, 'rejected')"
                      :disabled="order.status_pembayaran === 'rejected' || !order.bukti_pembayaran"
                      class="px-4 py-2 md:px-6 md:py-3 bg-white text-red-500 border border-red-100 rounded-xl font-bold text-xs hover:bg-red-50 transition active:scale-95 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-transparent">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="orders.length === 0">
                <td colspan="4" class="p-16 md:p-20 text-center text-gray-400 font-medium text-sm">
                  Belum ada pesanan yang masuk untuk diverifikasi.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL BUKTI TRANSFER -->
    <Transition name="fade">
      <div v-if="selectedImage" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div @click="selectedImage = null" class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-[2.5rem] p-3 max-w-xl w-full flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
          
          <!-- Header with Close Button (Fixed at top of modal) -->
          <div class="flex justify-between items-center px-4 py-2 border-b border-gray-50 flex-shrink-0">
            <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Detail Bukti Transfer</p>
            <button @click="selectedImage = null" class="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>

          <!-- Image Container (Scrollable) -->
          <div class="flex-grow overflow-y-auto p-2 custom-scrollbar">
            <img :src="`http://localhost:8080/uploads/payment/${selectedImage}`" class="w-full h-auto rounded-2xl" />
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import api from "../../services/api";
import { toast, confirm } from "../../utils/swal";

const orders = ref([]);
const selectedImage = ref(null);

const showBukti = (img) => {
  selectedImage.value = img;
};

const getOrders = async () => {
  try {
    const res = await api.get("/orders");
    // Tampilkan hanya yang sudah ada aksi (waiting, paid, rejected)
    orders.value = res.data.filter(o => o.status_pembayaran !== 'unpaid');
  } catch (error) {
    console.error("Gagal mengambil data verifikasi:", error);
  }
};

const verify = async (id, status) => {
  const isConfirmed = await confirm(
    `Konfirmasi Pembayaran`,
    `Apakah Anda yakin ingin ${status === 'paid' ? 'menyetujui' : 'menolak'} pembayaran ini?`,
    status === 'paid' ? 'success' : 'warning'
  );

  if (isConfirmed) {
    try {
      await api.post(`/payment/verify/${id}`, { status });
      toast(`Berhasil: Pembayaran di-${status === 'paid' ? 'setujui' : 'tolak'}!`, "success");
      getOrders();
    } catch (error) {
      toast("Gagal memproses verifikasi.", "error");
      console.error(error);
    }
  }
};

onMounted(() => {
  getOrders();

  const socket = io("http://localhost:3000");
  socket.on("order-baru", () => {
    getOrders();
  });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
</style>