import Swal from 'sweetalert2';

const MySwal = Swal.mixin({
  customClass: {
    confirmButton: 'bg-primary text-white px-8 py-3 rounded-2xl mx-2 font-black text-xs uppercase tracking-widest hover:bg-green-700 transition shadow-lg shadow-primary/20',
    cancelButton: 'bg-gray-100 text-gray-500 px-8 py-3 rounded-2xl mx-2 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition',
    popup: 'rounded-[2rem] border-none shadow-2xl bg-white p-8',
    title: 'text-gray-900 font-extrabold tracking-tight text-xl',
    htmlContainer: 'text-gray-600 font-medium text-sm mt-2',
  },
  buttonsStyling: false
});

export const toast = (title, icon = 'success') => {
  MySwal.fire({
    title,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#111827'
  });
};

export const confirm = async (title = 'Konfirmasi', text = 'Apakah Anda yakin?', icon = 'warning') => {
  const result = await MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal',
    reverseButtons: true
  });
  return result.isConfirmed;
};

export const confirmDelete = async (title = 'Hapus Data?') => {
  return await confirm(title, 'Data yang dihapus tidak bisa dikembalikan!', 'warning');
};

export default MySwal;
