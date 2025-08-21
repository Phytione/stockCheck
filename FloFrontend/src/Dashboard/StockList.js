import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const lowStock = products.filter(p => p.stock <= 5);

  return (
    <div>
      <h2>Stokta Azalan Ürünler</h2>
      <ul>
        {lowStock.length > 0 ? (
          lowStock.map(p => (
            <li key={p.id}>
              {p.name} - Stok: {p.stock}
            </li>
          ))
        ) : (
          <li>Tüm ürünlerin stoğu yeterli.</li>
        )}
      </ul>
    </div>
  );
};

export default StockList;
