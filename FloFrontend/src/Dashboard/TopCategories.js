import React, { useEffect, useState } from "react";
import axios from "axios";

function TopCategories() {
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const salesRes = await axios.get("http://localhost:5187/sales");
        const productsRes = await axios.get("http://localhost:5187/products");

        const sales = salesRes.data;
        const products = productsRes.data;

        const categoryTotals = {};

        sales.forEach((sale) => {
          const product = products.find((p) => p.id === sale.productId);
          if (product) {
            if (!categoryTotals[product.category]) categoryTotals[product.category] = 0;
            categoryTotals[product.category] += sale.quantity;
          }
        });

        const result = Object.keys(categoryTotals).map((cat) => ({
          category: cat,
          totalSold: categoryTotals[cat],
        }));

        setTopCategories(result.sort((a, b) => b.totalSold - a.totalSold));
      } catch (err) {
        console.error("TopCategories fetch error:", err);
      }
    };

    fetchTopCategories();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 className="section-title">📈 En Çok Satan Kategoriler</h2>
      <table style={{ width: "100%", background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
        <thead style={{ background: "#383946", color: "white" }}>
          <tr>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Kategori</th>
            <th style={{ padding: "0.75rem", textAlign: "right" }}>Toplam Satış</th>
          </tr>
        </thead>
        <tbody>
          {topCategories.length === 0 && (
            <tr>
              <td colSpan="2" style={{ padding: "0.75rem", textAlign: "center" }}>Satış verisi yok</td>
            </tr>
          )}
          {topCategories.map((c, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.75rem" }}>{c.category}</td>
              <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600" }}>{c.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopCategories;
