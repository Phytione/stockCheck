import React from "react";
import StockList from "../Dashboard/StockList";
import TopProducts from "../Dashboard/TopProducts";
import TopCategories from "../Dashboard/TopCategories";

function StocksPage() {
  return (
    <>
      <StockList />
      <TopProducts />
      <TopCategories />
    </>
  );
}

export default StocksPage;
