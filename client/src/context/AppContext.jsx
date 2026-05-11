// FILE: src/context/AppContext.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

const AppContext = createContext(null);

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "[]"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  orders: JSON.parse(localStorage.getItem("orders") || "[]"),
  toasts: [],
  searchQuery: "",
  filters: { category: "all", minPrice: 0, maxPrice: Infinity, sort: "default", rating: 0 },
  compareList: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD": {
      const exists = state.cart.find((i) => i.id === action.item.id && i.variant === action.item.variant);
      const cart = exists
        ? state.cart.map((i) =>
            i.id === action.item.id && i.variant === action.item.variant
              ? { ...i, qty: i.qty + (action.item.qty || 1) }
              : i
          )
        : [...state.cart, { ...action.item, qty: action.item.qty || 1 }];
      return { ...state, cart };
    }
    case "CART_REMOVE":
      return { ...state, cart: state.cart.filter((i) => !(i.id === action.id && i.variant === action.variant)) };
    case "CART_UPDATE_QTY": {
      const cart = action.qty <= 0
        ? state.cart.filter((i) => i.id !== action.id)
        : state.cart.map((i) => i.id === action.id ? { ...i, qty: action.qty } : i);
      return { ...state, cart };
    }
    case "CART_CLEAR":
      return { ...state, cart: [] };

    case "WISHLIST_TOGGLE": {
      const inList = state.wishlist.find((i) => i.id === action.item.id);
      const wishlist = inList
        ? state.wishlist.filter((i) => i.id !== action.item.id)
        : [...state.wishlist, action.item];
      return { ...state, wishlist };
    }
    case "WISHLIST_MOVE_TO_CART": {
      const item = state.wishlist.find((i) => i.id === action.id);
      if (!item) return state;
      const exists = state.cart.find((i) => i.id === item.id);
      const cart = exists
        ? state.cart.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.cart, { ...item, qty: 1 }];
      return { ...state, cart, wishlist: state.wishlist.filter((i) => i.id !== action.id) };
    }

    case "AUTH_LOGIN":
      return { ...state, user: action.user };
    case "AUTH_LOGOUT":
      return { ...state, user: null };
    case "AUTH_UPDATE":
      return { ...state, user: { ...state.user, ...action.data } };

    case "ORDER_PLACE": {
      const order = {
        id: `ORD-${Date.now()}`,
        userId: action.userId,           // ✅ ties order to the buyer
        items: state.cart,
        total: action.total,
        shipping: action.shipping,
        payment: action.payment,
        status: "Processing",
        date: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      };
      return { ...state, orders: [order, ...state.orders], cart: [] };
    }

    case "TOAST_ADD":
      return { ...state, toasts: [...state.toasts, action.toast] };
    case "TOAST_REMOVE":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.query };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.filter } };
    case "RESET_FILTERS":
      return { ...state, filters: { category: "all", minPrice: 0, maxPrice: Infinity, sort: "default", rating: 0 }, searchQuery: "" };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(state.cart)); }, [state.cart]);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(state.wishlist)); }, [state.wishlist]);
  useEffect(() => { localStorage.setItem("orders", JSON.stringify(state.orders)); }, [state.orders]);
  useEffect(() => {
    if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
    else localStorage.removeItem("user");
  }, [state.user]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    dispatch({ type: "TOAST_ADD", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "TOAST_REMOVE", id }), 4000);
  }, []);

  const addToCart = useCallback((item) => {
    dispatch({ type: "CART_ADD", item });
    toast(`"${item.title}" added to cart!`);
  }, [toast]);

  const removeFromCart = useCallback((id, variant) => {
    dispatch({ type: "CART_REMOVE", id, variant });
  }, []);

  const updateQty = useCallback((id, qty) => {
    dispatch({ type: "CART_UPDATE_QTY", id, qty });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CART_CLEAR" }), []);

  const toggleWishlist = useCallback((item) => {
    const inList = state.wishlist.find((i) => i.id === item.id);
    dispatch({ type: "WISHLIST_TOGGLE", item });
    toast(inList ? "Removed from wishlist" : "Added to wishlist ❤️", inList ? "info" : "success");
  }, [state.wishlist, toast]);

  const isWishlisted = useCallback((id) => state.wishlist.some((i) => i.id === id), [state.wishlist]);

  const moveToCart = useCallback((id) => {
    dispatch({ type: "WISHLIST_MOVE_TO_CART", id });
    toast("Item moved to cart!");
  }, [toast]);

  const login = useCallback((user) => {
    dispatch({ type: "AUTH_LOGIN", user });
    toast(`Welcome back, ${user.name}!`);
  }, [toast]);

  const logout = useCallback(() => {
    dispatch({ type: "AUTH_LOGOUT" });
    toast("Logged out successfully", "info");
  }, [toast]);

  const updateProfile = useCallback((data) => {
    dispatch({ type: "AUTH_UPDATE", data });
    toast("Profile updated successfully!");
  }, [toast]);

  // ✅ passes current user's id so the order is tied to the buyer
  const placeOrder = useCallback((total, shipping, payment) => {
    dispatch({ type: "ORDER_PLACE", total, shipping, payment, userId: state.user?.id });
  }, [state.user]);

  const cartTotal = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = state.cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <AppContext.Provider value={{
      ...state, cartTotal, cartCount,
      addToCart, removeFromCart, updateQty, clearCart,
      toggleWishlist, isWishlisted, moveToCart,
      login, logout, updateProfile,
      placeOrder, toast, dispatch,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};