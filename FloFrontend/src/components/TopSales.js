import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopSales = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topBrands, setTopBrands] = useState([]);

  useEffect(() => {
    // En çok satan ürünleri çek
    axios.get('http://localhost:5187/top-selling-products')
      .then(res => setTopProducts(res.data))
      .catch(err => console.error('En çok satan ürünler çekilemedi:', err));

    // En çok satan kategorileri çek
    axios.get('http://localhost:5187/top-selling-categories')
      .then(res => setTopCategories(res.data))
      .catch(err => console.error('En çok satan kategoriler çekilemedi:', err));

    // En çok satan markaları çek
    axios.get('http://localhost:5187/top-selling-brands')
      .then(res => setTopBrands(res.data))
      .catch(err => console.error('En çok satan markalar çekilemedi:', err));
  }, []);

  return (
    <div className="top-sales-container">
      <h2>En Çok Satan Ürünler</h2>
      <ol>
        {topProducts.map((p, index) => (
          <li key={index}>
            {p.name} ({p.brand}) - {p.totalQuantitySold} Adet
          </li>
        ))}
      </ol>

      <hr />

      <h2>En Çok Satan Kategoriler</h2>
      <ol>
        {topCategories.map((c, index) => (
          <li key={index}>
            {c.category} - {c.totalQuantitySold} Adet
          </li>
        ))}
      </ol>

      <hr />

      <h2>En Çok Satan Markalar</h2>
      <ol>
        {topBrands.map((b, index) => (
          <li key={index}>
            {b.brand} - {b.totalQuantitySold} Adet
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TopSales;