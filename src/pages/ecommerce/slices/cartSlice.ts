import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItemModel, WishlistItemModel, CompareItemModel } from '../models/CartModel';
import { ProductModel } from '../models/ProductModel';

interface CartState {
  items: CartItemModel[];
  wishlist: WishlistItemModel[];
  compare: CompareItemModel[];
}

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const initialState: CartState = {
  items: loadFromLocalStorage('ecommerce_cart', []),
  wishlist: loadFromLocalStorage('ecommerce_wishlist', []),
  compare: loadFromLocalStorage('ecommerce_compare', []),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: ProductModel; quantity: number }>) => {
      const existingItem = state.items.find((item) => item.product.id === action.payload.product.id);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          product: action.payload.product,
          quantity: action.payload.quantity,
          addedAt: new Date().toISOString(),
        });
      }

      saveToLocalStorage('ecommerce_cart', state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      saveToLocalStorage('ecommerce_cart', state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.items.find((item) => item.product.id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        saveToLocalStorage('ecommerce_cart', state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      saveToLocalStorage('ecommerce_cart', []);
    },

    addToWishlist: (state, action: PayloadAction<ProductModel>) => {
      const exists = state.wishlist.find((item) => item.product.id === action.payload.id);

      if (!exists) {
        state.wishlist.push({
          product: action.payload,
          addedAt: new Date().toISOString(),
        });
        saveToLocalStorage('ecommerce_wishlist', state.wishlist);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.wishlist = state.wishlist.filter((item) => item.product.id !== action.payload);
      saveToLocalStorage('ecommerce_wishlist', state.wishlist);
    },

    moveWishlistToCart: (state, action: PayloadAction<number>) => {
      const wishlistItem = state.wishlist.find((item) => item.product.id === action.payload);

      if (wishlistItem) {
        const existingCartItem = state.items.find((item) => item.product.id === action.payload);

        if (existingCartItem) {
          existingCartItem.quantity += 1;
        } else {
          state.items.push({
            product: wishlistItem.product,
            quantity: 1,
            addedAt: new Date().toISOString(),
          });
        }

        state.wishlist = state.wishlist.filter((item) => item.product.id !== action.payload);

        saveToLocalStorage('ecommerce_cart', state.items);
        saveToLocalStorage('ecommerce_wishlist', state.wishlist);
      }
    },

    addToCompare: (state, action: PayloadAction<ProductModel>) => {
      const exists = state.compare.find((item) => item.product.id === action.payload.id);

      if (!exists && state.compare.length < 4) {
        state.compare.push({
          product: action.payload,
          addedAt: new Date().toISOString(),
        });
        saveToLocalStorage('ecommerce_compare', state.compare);
      }
    },

    removeFromCompare: (state, action: PayloadAction<number>) => {
      state.compare = state.compare.filter((item) => item.product.id !== action.payload);
      saveToLocalStorage('ecommerce_compare', state.compare);
    },

    clearCompare: (state) => {
      state.compare = [];
      saveToLocalStorage('ecommerce_compare', []);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  moveWishlistToCart,
  addToCompare,
  removeFromCompare,
  clearCompare,
} = cartSlice.actions;

export default cartSlice.reducer;
