<template>
  <div class="p-8 min-h-screen bg-[#F9FAFB]">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Ringkasan Bisnis</h1>
          <p class="text-sm font-medium text-gray-500 mt-1">Pantau performa resto Anda secara real-time.</p>
        </div>
        
        <!-- Notification Toast -->
        <transition enter-active-class="transition ease-out duration-300" enter-from-class="transform opacity-0 translate-y-4" enter-to-class="transform opacity-100 translate-y-0">
          <div v-if="notif" class="bg-white px-6 py-4 rounded-2xl shadow-xl border-l-4 border-primary flex items-center gap-4 animate-bounce">
            <div class="bg-primary/10 p-2 rounded-xl">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900">Pesanan Baru!</p>
              <p class="text-[10px] text-gray-500">{{ new Date(notif.time).toLocaleTimeString() }}</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-300">
          <div class="p-4 bg-primary/5 rounded-2xl mb-4 group-hover:scale-110 transition duration-500">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <p class="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2">Total Pesanan</p>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{{ stats.total_orders }}</h2>
        </div>

        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-secondary/30 transition-all duration-300">
          <div class="p-3 bg-secondary/5 rounded-xl mb-3 group-hover:scale-110 transition duration-500">
            <svg class="w-6 h-6 md:w-8 md:h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <p class="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2">Total Omzet</p>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Rp {{ Number(stats.total_revenue).toLocaleString('id-ID') }}</h2>
        </div>

        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-accent/30 transition-all duration-500">
          <div class="p-3 bg-accent/5 rounded-xl mb-3 group-hover:scale-110 transition duration-500">
            <svg class="w-6 h-6 md:w-8 md:h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <p class="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2">Item Menu</p>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{{ stats.total_menu }}</h2>
        </div>
      </div>

      <!-- Sales Chart -->
      <div class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Tren Penjualan</h3>
            <p class="text-xs font-medium text-gray-500 mt-1">Omzet dalam 7 hari terakhir</p>
          </div>
          <div class="flex gap-2 hidden md:flex">
            <div class="w-3 h-3 bg-primary rounded-full"></div>
            <div class="w-3 h-3 bg-primary/20 rounded-full"></div>
          </div>
        </div>
        <div class="h-[400px]">
          <Line v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
          <div v-else class="h-full flex items-center justify-center text-gray-300 italic text-sm">
            Belum ada data penjualan hari ini.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import api from "../../services/api";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

const notif = ref(null);
const stats = ref({
  total_orders: 0,
  total_revenue: 0,
  total_menu: 0
});

// Chart State
const chartData = ref({
  labels: [],
  datasets: []
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => "Rp " + value.toLocaleString('id-ID')
      }
    }
  }
};

const getStats = async () => {
  try {
    const res = await api.get("/dashboard/stats");
    const data = res.data.data;
    
    stats.value = {
      total_orders: data.total_orders,
      total_revenue: data.total_revenue,
      total_menu: data.total_menu
    };

    // Process Chart Data
    if (data.chart_data && data.chart_data.length > 0) {
      chartData.value = {
        labels: data.chart_data.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        }),
        datasets: [{
          label: 'Penjualan',
          data: data.chart_data.map(item => item.total),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      };
    }
  } catch (error) {
    console.error("Gagal mengambil statistik dashboard", error);
  }
};

onMounted(() => {
  getStats();

  const socket = io("http://localhost:3000");

  socket.on("order-baru", (data) => {
    notif.value = data;
    getStats();

    try {
      const audio = new Audio("/notif.mp3");
      audio.play().catch(e => console.log("Audio autoplay prevented"));
    } catch(e) {}

    setTimeout(() => {
      notif.value = null;
    }, 5000);
  });
});
</script>