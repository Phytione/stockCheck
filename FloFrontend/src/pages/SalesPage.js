import React from "react";
import AddSale from "../components/AddSale";
import SaleList from "../components/SaleList";

function SalesPage() {
  return (
    <>
      <h1 className="section-title">Satış Yönetimi</h1>
      <AddSale />
      <SaleList />
    </>
  );
}

export default SalesPage;
