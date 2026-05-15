// FILE: src/App.jsx

import { lazy, Suspense, useState, useMemo, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastContainer from './components/ui/ToastContainer'
import { BRANDS, products } from './data/products'
import { USD_TO_KSH } from './components/ProductCard'

const HomePage          = lazy(() => import('./pages/HomePage'))
const ProductsPage      = lazy(() => import('./pages/ProductsPage'))
const ProductDetail     = lazy(() => import('./pages/ProductDetailPage'))
const CartPage          = lazy(() => import('./pages/CartPage'))
const AuthPage          = lazy(() => import('./pages/AuthPage'))
const CheckoutPage      = lazy(() => import('./pages/CheckoutPage'))
const WishlistPage      = lazy(() => import('./pages/WishlistPage'))
const OrdersPage        = lazy(() => import('./pages/OrderPage'))
const AccountPage       = lazy(() => import('./pages/AccountPage'))
const OrderSuccess      = lazy(() => import('./pages/OrderSuccessPage'))
const AboutPage         = lazy(() => import('./pages/AboutPage'))
const HelpPage          = lazy(() => import('./pages/HelpPage'))
const ContactPage       = lazy(() => import('./pages/ContactPage'))
const PrivacyPage       = lazy(() => import('./pages/PrivacyPage'))
const TermsPage         = lazy(() => import('./pages/TermsPage'))
const SitemapPage       = lazy(() => import('./pages/SitemapPage'))
const ReturnsPage       = lazy(() => import('./pages/ReturnsPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Most Popular" },
]

function Loader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-semibold">Loading...</p>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-black text-gray-100 mb-2">404</p>
      <h2 className="text-2xl font-black text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-6">The page you are looking for does not exist.</p>
      <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-xl transition">
        Go Home
      </a>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AuthRoute({ children }) {
  const { user } = useApp()
  if (user) return <Navigate to="/" replace />
  return children
}

function AppShell() {
  const location = useLocation()
  const { filters, dispatch } = useApp()
  const isProductsPage = location.pathname === '/products'

  const [navHeight, setNavHeight]           = useState(96)
  const [viewMode, setViewMode]             = useState("grid")
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceMin, setPriceMin]             = useState(0)
  const [priceMax, setPriceMax]             = useState(Infinity)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return
    const ro = new ResizeObserver(() => setNavHeight(header.offsetHeight))
    ro.observe(header)
    setNavHeight(header.offsetHeight)
    return () => ro.disconnect()
  }, [])

  const resetAll = () => {
    dispatch({ type: "RESET_FILTERS" })
    setSelectedBrands([])
    setPriceMin(0)
    setPriceMax(Infinity)
  }

  const filteredCount = useMemo(() => {
    if (!isProductsPage) return 0
    let result = [...products]
    if (filters.category !== "all") result = result.filter(p => p.category === filters.category)
    if (selectedBrands.length > 0)  result = result.filter(p => selectedBrands.includes(p.brand))
    const minUSD = priceMin / USD_TO_KSH
    const maxUSD = priceMax === Infinity ? Infinity : priceMax / USD_TO_KSH
    result = result.filter(p => p.price >= minUSD && p.price <= maxUSD)
    return result.length
  }, [isProductsPage, filters.category, selectedBrands, priceMin, priceMax])

  const handleToggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(x => x !== brand) : [...prev, brand]
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar
        filteredCount={filteredCount}
        sortValue={filters.sort}
        onSortChange={(val) => dispatch({ type: "SET_FILTER", filter: { sort: val } })}
        sortOptions={isProductsPage ? SORT_OPTIONS : undefined}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onPriceRange={(min, max) => { setPriceMin(min); setPriceMax(max) }}
        activePriceMin={priceMin}
        activePriceMax={priceMax}
        brands={BRANDS}
        selectedBrands={selectedBrands}
        onToggleBrand={handleToggleBrand}
        onResetAll={resetAll}
        onOpenMobileFilters={() => setMobileFilterOpen(true)}
      />

      <main className="flex-1" style={{ paddingTop: navHeight }}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/"               element={<HomePage />} />
            <Route path="/products"       element={
                <ProductsPage
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  priceMin={priceMin}
                  setPriceMin={setPriceMin}
                  priceMax={priceMax}
                  setPriceMax={setPriceMax}
                  mobileFilterOpen={mobileFilterOpen}
                  setMobileFilterOpen={setMobileFilterOpen}
                  resetAll={resetAll}
                />
              }
            />
            <Route path="/product/:id"    element={<ProductDetail />} />
            <Route path="/cart"           element={<CartPage />} />
            <Route path="/about"          element={<AboutPage />} />
            <Route path="/help"           element={<HelpPage />} />
            <Route path="/returns"        element={<ReturnsPage />} />
            <Route path="/contact"        element={<ContactPage />} />
            <Route path="/privacy"        element={<PrivacyPage />} />
            <Route path="/terms"          element={<TermsPage />} />
            <Route path="/sitemap"        element={<SitemapPage />} />
            <Route path="/checkout"       element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/wishlist"       element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
            <Route path="/orders"         element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path="/account"        element={<PrivateRoute><AccountPage /></PrivateRoute>} />
            <Route path="/order-success"  element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
            <Route path="/auth"           element={<AuthRoute><AuthPage /></AuthRoute>} />
            <Route path="/forgot-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password"  element={<ResetPasswordPage />} />
            <Route path="*"               element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  )
}