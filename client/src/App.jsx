import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastContainer from './components/ui/ToastContainer'

const HomePage       = lazy(() => import('./pages/HomePage'))
const ProductsPage   = lazy(() => import('./pages/ProductsPage'))
const ProductDetail  = lazy(() => import('./pages/ProductDetailPage'))
const CartPage       = lazy(() => import('./pages/CartPage'))
const AuthPage       = lazy(() => import('./pages/AuthPage'))
const CheckoutPage   = lazy(() => import('./pages/CheckoutPage'))
const WishlistPage   = lazy(() => import('./pages/WishlistPage'))
const OrdersPage     = lazy(() => import('./pages/OrderPage'))
const AccountPage    = lazy(() => import('./pages/AccountPage'))
const OrderSuccess   = lazy(() => import('./pages/OrderSuccessPage'))

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

// Wrapper for protected routes
function PrivateRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/auth" replace />
  return children
}

// Redirect logged-in users from auth page
function AuthRoute({ children }) {
  const { user } = useApp()
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Protected routes */}
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <CheckoutPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <PrivateRoute>
                      <WishlistPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <OrdersPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <PrivateRoute>
                      <AccountPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/order-success"
                  element={
                    <PrivateRoute>
                      <OrderSuccess />
                    </PrivateRoute>
                  }
                />

                {/* Auth route */}
                <Route
                  path="/auth"
                  element={
                    <AuthRoute>
                      <AuthPage />
                    </AuthRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}