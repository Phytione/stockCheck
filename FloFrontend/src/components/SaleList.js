import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SaleList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5187/sales')
      .then(res => setSales(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Satış Listesi</h2>
      <ul>
        {sales.map(s => (
          <li key={s.id}>
            Ürün ID: {s.productId}, Miktar: {s.quantity}, Tarih: {new Date(s.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SaleList;
