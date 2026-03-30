// FILE: src/App.jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/ui/ToastContainer";
import HeroBanner from "./components/HeroBanner";
import { SkeletonCard } from "./components/ui/Skeleton";

const ProductList   = lazy(() => import("./components/ProductList"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const Cart          = lazy(() => import("./components/Cart"));
const AuthPage      = lazy(() => import("./pages/AuthPage"));
const CheckoutPage  = lazy(() => import("./pages/CheckoutPage"));
const WishlistPage  = lazy(() => import("./pages/WishlistPage"));
const OrderSuccess  = lazy(() => import("./pages/OrderSuccessPage"));

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <HeroBanner />
      <ProductList />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"              element={<HomePage />} />
                <Route path="/product/:id"   element={<ProductDetail />} />
                <Route path="/cart"          element={<Cart />} />
                <Route path="/wishlist"      element={<WishlistPage />} />
                <Route path="/auth"          element={<AuthPage />} />
                <Route path="/checkout"      element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                    <h1 className="text-6xl font-extrabold text-slate-200 mb-4">404</h1>
                    <p className="text-slate-500 mb-6">This page doesn't exist.</p>
                    <a href="/" className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition">
                      Go Home
                    </a>
                  </div>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}