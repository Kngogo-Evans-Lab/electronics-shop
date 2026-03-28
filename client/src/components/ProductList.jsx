import ProductCard from "./ProductCard";

function ProductList({
  products,
  onAddToCart,
  onViewDetails,
  contactPhone,
  whatsappNumber,
  salePrice,
}) {
  return (
    <div className="products-grid">
      {Array.isArray(products) ? products.map((product) => (

        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
          contactPhone={contactPhone}
          whatsappNumber={whatsappNumber}
          salePrice={salePrice}
        />
      ))}
    </div>
  );
}

export default ProductList;
