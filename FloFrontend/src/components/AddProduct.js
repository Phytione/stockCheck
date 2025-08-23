import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');        // 👈 beden
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const product = {
        name,
        brand,
        category,
        size,                                    // 👈 beden backend'e gidiyor
        price: parseFloat(price),
        stock: parseInt(stock, 10)
      };

      const res = await axios.post('http://localhost:5187/products', product);
      console.log('Ürün eklendi:', res.data);

      setName('');
      setBrand('');
      setCategory('');
      setSize('');                              // 👈 temizle
      setPrice('');
      setStock('');
    } catch (error) {
      console.error('Ürün eklenemedi:', error);
      alert('Ürün eklenemedi! Konsolu kontrol et.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Yeni Ürün Ekle</h3>
      <input placeholder="Ürün Adı" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Marka" value={brand} onChange={e => setBrand(e.target.value)} />
      <input placeholder="Kategori" value={category} onChange={e => setCategory(e.target.value)} />
      <input placeholder="Beden" value={size} onChange={e => setSize(e.target.value)} /> {/* 👈 beden girişi */}
      <input placeholder="Fiyat" type="number" value={price} onChange={e => setPrice(e.target.value)} />
      <input placeholder="Stok" type="number" value={stock} onChange={e => setStock(e.target.value)} />
      <button type="submit">Ekle</button>
    </form>
  );
};

export default AddProduct;
