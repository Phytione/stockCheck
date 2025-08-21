import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const product = {
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock)
      };

      const res = await axios.post('http://localhost:5187/products', product);
      console.log('Ürün eklendi:', res.data);
      //alert('Ürün başarıyla eklendi!');

      // inputları temizle
      setName('');
      setCategory('');
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
      <input placeholder="Kategori" value={category} onChange={e => setCategory(e.target.value)} />
      <input placeholder="Fiyat" type="number" value={price} onChange={e => setPrice(e.target.value)} />
      <input placeholder="Stok" type="number" value={stock} onChange={e => setStock(e.target.value)} />
      <button type="submit">Ekle</button>
    </form>
  );
};

export default AddProduct;
