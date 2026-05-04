<template>
  <div class="min-h-screen bg-[#F9FAFB] p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Menu</h1>
          <p class="text-sm font-medium text-gray-500 mt-1">Kelola hidangan dan ketersediaan stok Anda.</p>
        </div>
        <button @click="openModal()" 
          class="w-full md:w-auto bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="3" stroke-linecap="round"/></svg>
          Tambah Menu
        </button>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left min-w-[600px]">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Foto</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Menu</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="p-4 md:p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in menu" :key="item.id" class="hover:bg-gray-50/30 transition-all group">
                <td class="p-4 md:p-6">
                  <img :src="item.gambar ? `http://localhost:8080/uploads/menu/${item.gambar}` : 'https://placehold.co/400x400?text=Menu'" class="w-12 h-12 md:w-16 md:h-16 object-cover rounded-xl shadow-sm border border-gray-50" />
                </td>
                <td class="p-4 md:p-6">
                  <h4 class="font-bold text-gray-900 leading-tight">{{ item.nama }}</h4>
                  <span class="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{{ item.kategori }}</span>
                </td>
                <td class="p-4 md:p-6 font-bold text-primary whitespace-nowrap">Rp {{ Number(item.harga).toLocaleString('id-ID') }}</td>
                <td class="p-4 md:p-6">
                  <span class="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap" :class="item.status_menu === 'tersedia' ? 'bg-green-50 text-primary' : 'bg-gray-100 text-gray-500'">
                    {{ item.status_menu }}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL FORM MENU -->
    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div @click="closeModal" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] flex flex-col">
          <div class="p-6 md:p-8 overflow-y-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
              <div class="w-1.5 h-6 bg-primary rounded-full"></div>
              {{ form.id ? 'Edit Menu' : 'Tambah Menu Baru' }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-5">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Nama Menu</label>
                  <input v-model="form.nama" placeholder="Ayam Goreng" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Harga (Rp)</label>
                  <input v-model="form.harga" type="number" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Kategori</label>
                  <div class="flex gap-2">
                    <button v-for="cat in ['makanan', 'minuman']" :key="cat" @click="form.kategori = cat" type="button" class="flex-1 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all border" :class="form.kategori === cat ? 'bg-primary text-white border-primary shadow-sm' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'">{{ cat }}</button>
                  </div>
                </div>
              </div>

              <div class="space-y-5">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Status</label>
                  <div class="relative">
                    <button @click="showStatusDropdown = !showStatusDropdown" type="button" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left flex justify-between items-center focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none">
                      <span class="font-bold text-gray-900 capitalize">{{ form.status_menu }}</span>
                      <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="{'rotate-180': showStatusDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div v-if="showStatusDropdown" class="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl py-2 overflow-hidden">
                      <button v-for="opt in ['tersedia', 'habis']" :key="opt" @click="form.status_menu = opt; showStatusDropdown = false" type="button" class="w-full text-left px-6 py-2.5 text-xs font-bold capitalize transition-colors flex items-center justify-between" :class="form.status_menu === opt ? 'text-primary bg-primary/5' : 'text-gray-600 hover:bg-gray-50'">{{ opt }}</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Foto Menu</label>
                  <div class="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <label class="flex-grow cursor-pointer group">
                      <div class="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 group-hover:border-primary group-hover:text-primary transition-all flex items-center justify-center gap-2">Pilih Gambar</div>
                      <input type="file" ref="fileInput" @change="handleFile" class="hidden" />
                    </label>
                    <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <img v-if="preview" :src="preview" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button @click="closeModal" class="px-6 py-3 rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition">Batal</button>
              <button @click="save" class="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-dark transition-all active:scale-95">
                {{ form.id ? 'Simpan Perubahan' : 'Terbitkan Menu' }}
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

const menu = ref([]);
const isModalOpen = ref(false);

const form = ref({
  id: null,
  nama: "",
  harga: "",
  kategori: "makanan",
  status_menu: "tersedia"
});

const file = ref(null);
const fileInput = ref(null);
const preview = ref(null);
const showStatusDropdown = ref(false);

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

const getMenu = async () => {
  try {
    const res = await api.get("/menu");
    menu.value = res.data.data;
  } catch (error) {
    console.error("Gagal mengambil menu:", error);
  }
};

const save = async () => {
  if (!form.value.nama || !form.value.harga) {
    toast("Nama dan Harga wajib diisi!", "error");
    return;
  }

  const formData = new FormData();
  formData.append("nama", form.value.nama);
  formData.append("harga", form.value.harga);
  formData.append("kategori", form.value.kategori);
  formData.append("status_menu", form.value.status_menu);

  if (file.value) {
    formData.append("gambar", file.value);
  }

  const config = {
    headers: { "Content-Type": "multipart/form-data" }
  };

  try {
    if (form.value.id) {
      formData.append("_method", "PUT");
      await api.post(`/menu/${form.value.id}`, formData, config);
      toast("Menu berhasil diperbarui!");
    } else {
      await api.post("/menu", formData, config);
      toast("Menu baru berhasil ditambahkan!");
    }
    closeModal();
    getMenu();
  } catch (error) {
    console.error("Gagal menyimpan menu:", error);
    toast("Gagal menyimpan menu.", "error");
  }
};

const hapus = async (id) => {
  const yakin = await confirmDelete("Hapus Menu Ini?");
  if (yakin) {
    try {
      await api.delete(`/menu/${id}`);
      toast("Menu berhasil dihapus!");
      getMenu();
    } catch (error) {
      console.error("Gagal menghapus menu:", error);
      toast("Gagal menghapus menu.", "error");
    }
  }
};

const edit = (item) => {
  form.value = { ...item };
  preview.value = item.gambar ? `http://localhost:8080/uploads/menu/${item.gambar}` : null;
  file.value = null;
  if (fileInput.value) fileInput.value.value = "";
  isModalOpen.value = true;
};

const resetForm = () => {
  form.value = {
    id: null,
    nama: "",
    harga: "",
    kategori: "makanan",
    status_menu: "tersedia"
  };
  file.value = null;
  preview.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

onMounted(() => {
  getMenu();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
