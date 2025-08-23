import React, { useState } from "react";
import AddProduct from "../components/AddProduct";
import ProductList from "../components/ProductList";
import '../styles/pages/ProductsPage.css';

function ProductsPage() {
  const [refreshProducts, setRefreshProducts] = useState(false);

  // Ürün eklendiğinde bu fonksiyon çağrılarak state güncellenecek
  const handleProductAdded = () => {
    setRefreshProducts(prev => !prev);
  };

  return (
    <div className="products-page-container">
      <h1 className="section-title">Ürün Yönetimi</h1>
      <div className="page-content-wrapper">
        <AddProduct onProductAdded={handleProductAdded} /> {/* 👈 prop eklendi */}
        <ProductList onUpdate={refreshProducts} /> {/* 👈 prop eklendi */}
      </div>
    </div>
  );
}

export default ProductsPage;