import { useSelector } from 'react-redux';
import { ProductModel } from '../models/ProductModel';
import { CartModel } from '../models/CartModel';
import store from '@/store';
import {
  addToCart as addToCartAction,
  removeFromCart,
  updateQuantity,
  clearCart,
  addToWishlist as addToWishlistAction,
  removeFromWishlist,
  moveWishlistToCart,
  addToCompare as addToCompareAction,
  removeFromCompare,
  clearCompare,
} from '../slices/cartSlice';

export const useCart = () => {
  const items = useSelector((state: any) => state.ecommerce_cart?.items || []);
  const wishlist = useSelector((state: any) => state.ecommerce_cart?.wishlist || []);
  const compare = useSelector((state: any) => state.ecommerce_cart?.compare || []);

  const calculateTotals = (): CartModel => {
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * 0.13;
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + tax + shipping;

    return {
      items,
      subtotal,
      tax,
      shipping,
      total,
    };
  };

  const addToCart = (product: ProductModel, quantity: number = 1) => {
    store.dispatch(addToCartAction({ product, quantity }));
  };

  const removeItem = (productId: number) => {
    store.dispatch(removeFromCart(productId));
  };

  const updateItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      store.dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const clearAllItems = () => {
    store.dispatch(clearCart());
  };

  const getTotalItems = (): number => {
    return items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  };

  const isInCart = (productId: number): boolean => {
    return items.some((item: any) => item.product.id === productId);
  };

  const getItemQuantity = (productId: number): number => {
    const item = items.find((item: any) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Wishlist
  const addToWishlist = (product: ProductModel) => {
    store.dispatch(addToWishlistAction(product));
  };

  const removeFromWishlistAction = (productId: number) => {
    store.dispatch(removeFromWishlist(productId));
  };

  const moveToCart = (productId: number) => {
    store.dispatch(moveWishlistToCart(productId));
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some((item: any) => item.product.id === productId);
  };

  const toggleWishlist = (product: ProductModel) => {
    if (isInWishlist(product.id)) {
      removeFromWishlistAction(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Compare
  const addToCompare = (product: ProductModel) => {
    if (compare.length < 4) {
      store.dispatch(addToCompareAction(product));
    }
  };

  const removeFromCompareAction = (productId: number) => {
    store.dispatch(removeFromCompare(productId));
  };

  const clearCompareList = () => {
    store.dispatch(clearCompare());
  };

  const isInCompare = (productId: number): boolean => {
    return compare.some((item: any) => item.product.id === productId);
  };

  const toggleCompare = (product: ProductModel) => {
    if (isInCompare(product.id)) {
      removeFromCompareAction(product.id);
    } else {
      addToCompare(product);
    }
  };

  const canAddToCompare = (): boolean => {
    return compare.length < 4;
  };

  return {
    // Cart
    items,
    cart: calculateTotals(),
    addToCart,
    removeItem,
    updateItemQuantity,
    clearAllItems,
    getTotalItems,
    isInCart,
    getItemQuantity,

    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist: removeFromWishlistAction,
    moveToCart,
    isInWishlist,
    toggleWishlist,

    // Compare
    compare,
    addToCompare,
    removeFromCompare: removeFromCompareAction,
    clearCompareList,
    isInCompare,
    toggleCompare,
    canAddToCompare,
  };
};
