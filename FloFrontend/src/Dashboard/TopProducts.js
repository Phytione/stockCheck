import React, { useEffect, useState } from "react";
import axios from "axios";

function TopProducts() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const salesRes = await axios.get("http://localhost:5187/sales");
        const productsRes = await axios.get("http://localhost:5187/products");

        const sales = salesRes.data;
        const products = productsRes.data;

        // ProductId bazlı toplam satışları hesapla
        const totals = {};
        sales.forEach((s) => {
          if (!totals[s.productId]) totals[s.productId] = 0;
          totals[s.productId] += s.quantity;
        });

        // Product bilgisiyle eşleştir
        const result = Object.keys(totals).map((id) => {
          const product = products.find((p) => p.id === parseInt(id));
          return {
            name: product ? product.name : "Bilinmeyen",
            totalSold: totals[id],
          };
        });

        // Çok satanlar sıralaması
        setTopProducts(result.sort((a, b) => b.totalSold - a.totalSold).slice(0, 5));
      } catch (error) {
        console.error("TopProducts fetch error:", error);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div style={{ marginTop: "3rem" }}>
      <h2 className="section-title">📊 En Çok Satan Ürünler</h2>
      <table style={{ width: "100%", background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
        <thead style={{ background: "#383946", color: "white" }}>
          <tr>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Ürün</th>
            <th style={{ padding: "0.75rem", textAlign: "right" }}>Toplam Satış</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((p, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.75rem" }}>{p.name}</td>
              <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600" }}>{p.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopProducts;
