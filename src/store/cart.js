import { reactive, computed } from 'vue';

const state = reactive({
  items: []
});

export const cartState = {
  get items() {
    return state.items;
  },

  addToCart(menuItem) {
    const existingItem = state.items.find(item => item.id === menuItem.id);
    if (existingItem) {
      existingItem.qty++;
    } else {
      state.items.push({
        id: menuItem.id,
        nama: menuItem.nama,
        harga: Number(menuItem.harga),
        gambar: menuItem.gambar,
        qty: 1
      });
    }
  },

  removeFromCart(itemId) {
    const index = state.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      state.items.splice(index, 1);
    }
  },

  updateQty(itemId, change) {
    const item = state.items.find(item => item.id === itemId);
    if (item) {
      item.qty += change;
      if (item.qty <= 0) {
        this.removeFromCart(itemId);
      }
    }
  },

  clearCart() {
    state.items = [];
  },
  
  get totalItems() {
    return state.items.reduce((acc, item) => acc + item.qty, 0);
  },

  get totalPrice() {
    return state.items.reduce((acc, item) => acc + (item.harga * item.qty), 0);
  }
};
