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

  const filteredProducts = category === 'All'
    ? products
    : products.filter(p => p.category === category);

  const maxStock = Math.max(...products.map(p => p.stock), 20); // varsayımsal max stok

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
        {filteredProducts.map(product => {
          const sold = getSoldQuantity(product.id);
          const remaining = Math.max(product.stock - sold, 0);
          const percent = (remaining / maxStock) * 100;

          let color = '#48bb78'; // yeşil
          if(percent < 20) color = '#f56565'; // kırmızı
          else if(percent < 50) color = '#ed8936'; // turuncu

          return (
            <div key={product.id} className="stock-card">
              <h3>{product.name}</h3>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${percent}%`, backgroundColor: color }}
                ></div>
              </div>
              <p>{remaining} adet stokta</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockList;
