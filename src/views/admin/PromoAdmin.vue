<template>
  <div class="min-h-screen bg-[#F9FAFB] p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Promo</h1>
          <p class="text-sm font-medium text-gray-500 mt-1">Kelola banner promo yang tampil di halaman pelanggan.</p>
        </div>
        <button @click="openModal()" 
          class="w-full md:w-auto bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="3" stroke-linecap="round"/></svg>
          Tambah Promo
        </button>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left min-w-[600px]">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Banner</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Judul & Deskripsi</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in promos" :key="item.id" class="hover:bg-gray-50/30 transition-all group">
                <td class="p-4 md:p-6">
                  <img :src="item.image ? `http://localhost:8080/uploads/promos/${item.image}` : 'https://placehold.co/800x400?text=Promo'" class="w-24 md:w-32 h-12 md:h-16 object-cover rounded-xl shadow-sm border border-gray-100" />
                </td>
                <td class="p-4 md:p-6">
                  <h4 class="font-bold text-gray-900 leading-tight">{{ item.title }}</h4>
                  <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ item.description || '-' }}</p>
                </td>
                <td class="p-4 md:p-6">
                  <span class="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap" :class="item.is_active == 1 ? 'bg-green-50 text-primary' : 'bg-gray-100 text-gray-500'">
                    {{ item.is_active == 1 ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="p-4 md:p-6">
                  <div class="flex justify-center gap-2">
                    <button @click="edit(item)" class="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-primary/10 hover:text-primary transition shadow-sm">
                      <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                    <button @click="hapus(item.id)" class="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition shadow-sm">
                      <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="promos.length === 0">
                <td colspan="4" class="p-8 md:p-10 text-center text-gray-400 font-medium">Belum ada promo yang ditambahkan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL FORM PROMO -->
    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div @click="closeModal" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] flex flex-col">
          <div class="p-6 md:p-8 overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
              <div class="w-1.5 h-6 bg-primary rounded-full"></div>
              {{ form.id ? 'Edit Promo' : 'Tambah Promo Baru' }}
            </h2>

            <div class="space-y-5">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Judul Promo</label>
                <input v-model="form.title" placeholder="Promo Spesial Kemerdekaan" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Deskripsi Singkat</label>
                <textarea v-model="form.description" rows="3" placeholder="Diskon 20% untuk semua menu..." class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"></textarea>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Status Publikasi</label>
                <div class="flex gap-4 items-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="form.is_active" :true-value="1" :false-value="0" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900">{{ form.is_active ? 'Aktif' : 'Tidak Aktif' }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Banner Promo (Rasio 2:1)</label>
                <div class="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div v-if="preview" class="w-full h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                    <img :src="preview" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex items-center gap-4">
                    <label class="flex-grow cursor-pointer group">
                      <div class="px-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 group-hover:border-primary group-hover:text-primary transition-all flex items-center justify-center gap-2">
                        Pilih Gambar Banner
                      </div>
                      <input type="file" ref="fileInput" @change="handleFile" class="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button @click="closeModal" class="px-6 py-3 rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition">Batal</button>
              <button @click="save" class="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-dark transition-all active:scale-95">
                {{ form.id ? 'Simpan Perubahan' : 'Terbitkan Promo' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { toast, confirmDelete } from "../../utils/swal";

const promos = ref([]);
const isModalOpen = ref(false);

const form = ref({
  id: null,
  title: "",
  description: "",
  is_active: 0
});

const file = ref(null);
const fileInput = ref(null);
const preview = ref(null);

const openModal = () => {
  resetForm();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const handleFile = (e) => {
  if (e.target.files.length > 0) {
    file.value = e.target.files[0];
    preview.value = URL.createObjectURL(file.value);
  }
};

const getPromos = async () => {
  try {
    const res = await api.get("/promos");
    promos.value = res.data.data;
  } catch (error) {
    console.error("Gagal mengambil promo:", error);
  }
};

const save = async () => {
  if (!form.value.title) {
    toast("Judul promo wajib diisi!", "error");
    return;
  }

  const formData = new FormData();
  formData.append("title", form.value.title);
  formData.append("description", form.value.description);
  formData.append("is_active", form.value.is_active);

  if (file.value) {
    formData.append("image", file.value);
  }

  const config = {
    headers: { "Content-Type": "multipart/form-data" }
  };

  try {
    if (form.value.id) {
      formData.append("_method", "PUT");
      await api.post(`/promos/${form.value.id}`, formData, config);
      toast("Promo berhasil diperbarui!");
    } else {
      await api.post("/promos", formData, config);
      toast("Promo baru berhasil ditambahkan!");
    }
    closeModal();
    getPromos();
  } catch (error) {
    console.error("Gagal menyimpan promo:", error);
    toast("Gagal menyimpan promo.", "error");
  }
};

const hapus = async (id) => {
  const yakin = await confirmDelete("Hapus Promo Ini?");
  if (yakin) {
    try {
      await api.delete(`/promos/${id}`);
      toast("Promo berhasil dihapus!");
      getPromos();
    } catch (error) {
      console.error("Gagal menghapus promo:", error);
      toast("Gagal menghapus promo.", "error");
    }
  }
};

const edit = (item) => {
  form.value = { ...item };
  preview.value = item.image ? `http://localhost:8080/uploads/promos/${item.image}` : null;
  file.value = null;
  if (fileInput.value) fileInput.value.value = "";
  isModalOpen.value = true;
};

const resetForm = () => {
  form.value = {
    id: null,
    title: "",
    description: "",
    is_active: 0
  };
  file.value = null;
  preview.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

onMounted(() => {
  getPromos();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
