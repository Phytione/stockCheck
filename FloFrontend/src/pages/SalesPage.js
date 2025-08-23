import React, { useState } from "react";
import AddSale from "../components/AddSale";
import SaleList from "../components/SaleList";
import '../styles/pages/SalesPage.css' // Yeni CSS dosyasını dahil ediyoruz

function SalesPage() {
  const [refreshSales, setRefreshSales] = useState(false);

  // Satış eklendiğinde listeyi yenilemek için bu fonksiyonu çağır
  const handleSaleAdded = () => {
    setRefreshSales(prev => !prev);
  };

  return (
    <div className="sales-page-container">
      <h1 className="section-title">Satış Yönetimi</h1>
      <div className="page-content-wrapper">
        <AddSale onSaleAdded={handleSaleAdded} />
        <SaleList onUpdate={refreshSales} />
      </div>
    </div>
  );
}

export default SalesPage;