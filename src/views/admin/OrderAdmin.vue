<template>
  <div class="min-h-screen bg-[#F9FAFB] p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Pesanan Masuk</h1>
          <p class="text-sm font-medium text-gray-600 mt-1">Pantau dan kelola pesanan pelanggan secara real-time.</p>
        </div>
        <button @click="getOrders" class="w-full md:w-auto p-3.5 bg-white text-primary border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm active:scale-95 flex justify-center items-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <!-- Order List Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left min-w-[600px]">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Kode Pesanan</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Meja</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status Bayar</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50/30 transition-all group">
                <td class="p-4 md:p-6">
                  <p class="text-xs font-bold text-gray-900">{{ new Date(order.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) }}</p>
                  <p class="text-[10px] text-gray-500 font-medium">{{ new Date(order.created_at).toLocaleDateString('id-ID') }}</p>
                </td>
                
                <td class="p-4 md:p-6">
                  <h3 class="font-bold text-gray-900 tracking-tight text-base md:text-lg">#{{ order.kode_order || order.id }}</h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Order ID</p>
                </td>

                <td class="p-4 md:p-6 text-center">
                  <div class="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                    <span class="text-base md:text-lg font-bold text-gray-900">{{ order.nomor_meja }}</span>
                  </div>
                </td>

                <td class="p-4 md:p-6 text-right font-bold text-gray-900 text-base md:text-lg whitespace-nowrap">
                  Rp {{ Number(order.total).toLocaleString('id-ID') }}
                </td>

                <td class="p-4 md:p-6 text-center">
                  <span class="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                    :class="{
                      'bg-yellow-50 text-yellow-600': order.status_pembayaran === 'waiting',
                      'bg-green-50 text-primary': order.status_pembayaran === 'paid',
                      'bg-red-50 text-red-500': order.status_pembayaran === 'rejected',
                      'bg-gray-50 text-gray-500': order.status_pembayaran === 'unpaid'
                    }">
                    {{ order.status_pembayaran }}
                  </span>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="orders.length === 0">
                <td colspan="5" class="p-16 md:p-20 text-center text-gray-400 font-medium text-sm">
                  Belum ada pesanan yang masuk hari ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import api from "../../services/api";

const orders = ref([]);

const getOrders = async () => {
  try {
    const res = await api.get("/orders");
    orders.value = res.data;
  } catch (error) {
    console.error("Gagal mengambil data pesanan", error);
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