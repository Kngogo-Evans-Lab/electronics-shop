import React from "react";

function ProductCard({ product, onAddToCart, onViewDetails, contactPhone, whatsappNumber, salePrice }) {
  const displaySalePrice = salePrice ?? product.salePrice ?? null;

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleView = () => {
    if (onViewDetails) onViewDetails(product);
  };

  return (
    <div className="product-card">
      <div
        className="product-image"
        onClick={handleView}
        role="button"
        tabIndex={0}
      >
        <img
  src={product.imageUrl || "/placeholder.png"}
  alt={product.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder.png";
  }}
/>

      </div>

      <div className="product-info">
        <h3
          className="product-name"
          onClick={handleView}
          role="button"
          tabIndex={0}
        >
          {product.name}
        </h3>
        {product.brand && <p className="brand">{product.brand}</p>}

        <div className="product-footer">
          <div className="price-block">
            <p className="price">KES {product.price.toLocaleString()}</p>
            {displaySalePrice && displaySalePrice !== product.price && (
              <p className="sale-price">
                Selling Price: KES {displaySalePrice.toLocaleString()}
              </p>
            )}
          </div>

          <div className="footer-actions">
            {product.inStock ? (
              <button className="btn-add-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
            ) : (
              <button className="btn-out-of-stock" disabled>
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
