import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import "./App.css";

function AppShell() {
  const [authModal, setAuthModal] = useState(null);

  return (
    <div className="app-shell">
      <Navbar onOpenAuth={setAuthModal} />
      <main className="app-main">
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart"        element={<CartPage />} />
          <Route path="/wishlist"    element={<WishlistPage />} />
          <Route path="*"            element={
            <div className="empty-state" style={{ marginTop: 80 }}>
              <span style={{ fontSize: 56 }}>🤷</span>
              <h3>Page not found</h3>
              <a href="/" className="btn-primary" style={{ marginTop: 16, display: "inline-block" }}>Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
      {authModal && (
        <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppShell />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}