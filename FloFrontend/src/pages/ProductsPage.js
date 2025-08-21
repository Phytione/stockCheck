import React from "react";
import AddProduct from "../components/AddProduct";
import ProductList from "../components/ProductList";

function ProductsPage() {
  return (
    <>
      <h1 className="section-title">Ürün Yönetimi</h1>
      <AddProduct />
    </>
  );
}

export default ProductsPage;
