import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5187/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Ürünler alınamadı:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h3>Ürün Listesi</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} | {p.category} | {p.price}₺ | Stok: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
