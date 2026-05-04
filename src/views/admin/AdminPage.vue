<template>
  <div class="flex bg-gray-50 min-h-screen relative w-full overflow-hidden">
    <!-- Mobile overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"></div>
    
    <!-- Sidebar -->
    <div :class="[
      'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <AdminSidebar :active-tab="current" @change="handleChange" />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden w-full">
      <!-- Mobile Header -->
      <div class="lg:hidden bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 z-30 shrink-0">
        <div class="flex items-center gap-3">
          <button @click="isSidebarOpen = true" class="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">QD</div>
            <h1 class="text-lg font-bold text-gray-900">QR DINE</h1>
          </div>
        </div>
      </div>
      
      <!-- Content Area -->
      <div class="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <Dashboard v-if="current === 'dashboard'" />
        <MenuAdmin v-if="current === 'menu'" />
        <OrderAdmin v-if="current === 'orders'" />
        <PaymentAdmin v-if="current === 'payment'" />
        <PromoAdmin v-if="current === 'promos'" />
        <PaymentSettings v-if="current === 'rekening'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AdminSidebar from "../../components/AdminSidebar.vue";
import Dashboard from "./Dashboard.vue";
import MenuAdmin from "./MenuAdmin.vue";
import OrderAdmin from "./OrderAdmin.vue";
import PaymentAdmin from "./PaymentAdmin.vue";
import PromoAdmin from "./PromoAdmin.vue";
import PaymentSettings from "./PaymentSettings.vue";

const current = ref("dashboard");
const isSidebarOpen = ref(false);

const handleChange = (tab) => {
  current.value = tab;
  isSidebarOpen.value = false; // close sidebar on mobile when tab changes
};
</script>