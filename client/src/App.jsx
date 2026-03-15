import { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import ProductDetail from "./components/ProductDetail";
import "./App.css";

// Use deployed backend URL from environment, fallback to localhost for dev
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/products";

// Cloudinary placeholder
const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/dr2u0jpvn/image/upload/v1773492892/placeholder_a1dh9w.jpg";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const CONTACT_PHONE = "+254745909218";
  const WHATSAPP_NUMBER = "+254745909218";
  const SALE_PRICE = null;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterPriceMin, setFilterPriceMin] = useState(0);
  const [filterPriceMax, setFilterPriceMax] = useState(10000000);
  const [filterInStock, setFilterInStock] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Replace missing images with Cloudinary placeholder
      const updated = data.map((p) => ({
        ...p,
        imageUrl: p.imageUrl || PLACEHOLDER_IMAGE,
      }));

      setProducts(updated);
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]); // fallback to empty
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const brands = ["All", ...new Set(products.map((p) => p.brand).filter(Boolean))];

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || p.category === filterCategory;
      const matchesBrand = filterBrand === "All" || p.brand === filterBrand;
      const matchesPrice = p.price >= filterPriceMin && p.price <= filterPriceMax;
      const matchesStock = !filterInStock || p.inStock;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) =>
    setCart(cart.filter((item) => item._id !== productId));
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) removeFromCart(productId);
    else
      setCart(cart.map((item) => (item._id === productId ? { ...item, quantity } : item)));
  };
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">sketch tech ecommerce</h1>
        </div>
      </header>

      <div className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h2>Top Quality products and services You Can Trust</h2>
            <p>Fast delivery within Nairobi • Order via WhatsApp or call to reserve</p>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) setShowFilterSidebar(true);
              }}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => {
                  setSearchTerm("");
                  setShowFilterSidebar(false);
                  setFilterCategory("All");
                  setFilterBrand("All");
                  setFilterPriceMin(0);
                  setFilterPriceMax(10000000);
                  setFilterInStock(false);
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>

          <div className="hero-actions">
            <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
              🛒 Cart ({cartCount})
            </button>
          </div>
        </div>
      </div>

      {showCart ? (
        <Cart
          cart={cart}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClose={() => setShowCart(false)}
        />
      ) : selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          allProducts={products}
          onAddToCart={(p, qty) => addToCart(p, qty)}
          onClose={() => setSelectedProduct(null)}
        />
      ) : (
        <main className="main-content">
          <div className="products-section">
            {showFilterSidebar && searchTerm && <aside className="filter-sidebar">{/* Filters */}</aside>}

            <div className={`products-content ${showFilterSidebar && searchTerm ? "with-sidebar" : ""}`}>
              {loading ? (
                <div className="loading">Loading products...</div>
              ) : filteredProducts.length > 0 ? (
                <ProductList
                  products={filteredProducts}
                  onAddToCart={addToCart}
                  onViewDetails={(p) => setSelectedProduct(p)}
                  contactPhone={CONTACT_PHONE}
                  whatsappNumber={WHATSAPP_NUMBER}
                  salePrice={SALE_PRICE}
                />
              ) : (
                <div className="no-results">
                  <p>No products found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      <footer className="footer">
        <p>&copy;Faith Electronics. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
