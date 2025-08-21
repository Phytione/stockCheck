import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockList = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:5187/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5187/sales')
      .then(res => setSales(res.data))
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const getSoldQuantity = (productId) =>
    sales.filter(s => s.productId === productId)
         .reduce((sum, s) => sum + s.quantity, 0);

  // Benzersiz ürünler
  const filteredProducts = category === 'All'
    ? products
    : products.filter(p => p.category === category);

  const maxStock = Math.max(...products.map(p => p.stock), 20);

  const uniqueProductsMap = {};
  filteredProducts.forEach(p => {
    const key = `${p.name}-${p.brand}-${p.category}-${p.price}`;
    const sold = getSoldQuantity(p.id);
    const remaining = Math.max(p.stock - sold, 0);

    if(uniqueProductsMap[key]) {
      uniqueProductsMap[key].stock += remaining;
    } else {
      uniqueProductsMap[key] = { ...p, stock: remaining };
    }
  });
  const uniqueProducts = Object.values(uniqueProductsMap);

  // En çok satan ürünler
  const productSales = {};
  sales.forEach(s => {
    const p = products.find(prod => prod.id === s.productId);
    if(p) {
      const key = `${p.name}-${p.brand}-${p.category}-${p.price}`;
      productSales[key] = (productSales[key] || 0) + s.quantity;
    }
  });
  const topProducts = Object.entries(productSales)
    .sort((a,b) => b[1]-a[1])
    .slice(0,5);

  // En çok satan marka
  const brandSales = {};
  sales.forEach(s => {
    const p = products.find(prod => prod.id === s.productId);
    const brandName = p?.brand || "Bilinmiyor";
    brandSales[brandName] = (brandSales[brandName] || 0) + s.quantity;
  });

  const maxBrandSale = Math.max(...Object.values(brandSales), 1); // 0 bölme hatasına karşı

  return (
    <div>
      <h1 className="section-title">Stok Durumu</h1>

      <div className="filter">
        <label>Kategori:</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="stock-cards">
        {uniqueProducts.map(product => {
          const percent = (product.stock / maxStock) * 100;
          let color = '#48bb78';
          if(percent < 20) color = '#f56565';
          else if(percent < 50) color = '#ed8936';

          return (
            <div key={`${product.name}-${product.brand}-${product.category}`} className="stock-card">
              <h3>{product.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#555' }}>Marka: {product.brand || "Bilinmiyor"}</p>
              <p style={{ fontSize: '0.85rem', color: '#555' }}>Kategori: {product.category}</p>
              <p style={{ fontSize: '0.85rem', color: '#555' }}>Fiyat: {product.price} TL</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${percent}%`, backgroundColor: color }}></div>
              </div>
              <p>{product.stock} adet stokta</p>
            </div>
          );
        })}
      </div>

      {/* En çok satan marka tablosu */}
      <div style={{ marginTop: '2rem' }}>
        <h2 className="section-title">En Çok Satan Markalar</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Marka</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Satış</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Oran</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(brandSales).sort((a,b)=>b[1]-a[1]).map(([brand, qty]) => {
              const percent = (qty / maxBrandSale) * 100;
              return (
                <tr key={brand}>
                  <td style={{ padding: '0.5rem' }}>{brand}</td>
                  <td style={{ padding: '0.5rem' }}>{qty}</td>
                  <td style={{ padding: '0.5rem', width: '50%' }}>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${percent}%`, backgroundColor: '#3182ce' }}></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default StockList;
