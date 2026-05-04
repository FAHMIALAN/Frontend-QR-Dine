<template>
  <div class="min-h-screen flex items-center justify-center bg-primary px-4 relative overflow-hidden">
    <!-- Abstract Background Decor -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl"></div>

    <div class="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl relative z-10 border border-white/20">
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl text-warm font-black text-3xl transform -rotate-6 hover:rotate-0 transition duration-300">
          QD
        </div>
        <h1 class="text-3xl font-black text-primary tracking-tight">Portal Admin</h1>
        <p class="text-secondary/60 text-sm mt-2 font-medium tracking-wide">Masuk untuk mengelola QR Dine</p>
      </div>

      <div class="space-y-6">
        <div>
          <label class="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">Username</label>
          <input v-model="username"
            type="text"
            placeholder="Masukkan username"
            class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-warm/5 focus:ring-2 focus:ring-accent outline-none transition font-bold text-primary placeholder:text-gray-300" />
        </div>

        <div>
          <label class="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">Password</label>
          <input v-model="password"
            type="password"
            placeholder="••••••••"
            @keyup.enter="login"
            class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-warm/5 focus:ring-2 focus:ring-accent outline-none transition font-bold text-primary placeholder:text-gray-300" />
        </div>

        <button @click="login" :disabled="isLoading"
          class="w-full bg-primary hover:bg-secondary text-warm font-black py-5 rounded-2xl transition shadow-xl shadow-primary/30 flex justify-center items-center gap-3 mt-8 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest active:scale-95">
          <svg v-if="isLoading" class="animate-spin h-6 w-6 text-warm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isLoading ? 'Memverifikasi...' : 'Masuk ke Panel' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { toast } from "../utils/swal";

const router = useRouter();
const username = ref("");
const password = ref("");
const isLoading = ref(false);

const login = async () => {
  if (!username.value || !password.value) {
    toast("Username dan password harus diisi!", "error");
    return;
  }

  try {
    isLoading.value = true;
    const res = await api.post("/login", {
      username: username.value,
      password: password.value
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("refresh_token", res.data.refresh_token);

    toast("Selamat Datang Kembali, Admin!");
    router.push("/admin");
  } catch (err) {
    console.error(err);
    toast("Login gagal! Cek kembali akun Anda.", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>