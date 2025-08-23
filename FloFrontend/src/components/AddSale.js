import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSale = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [size, setSize] = useState('');      // 👈 seçili ürünün bedeni (tek değer)
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5187/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Ürün değiştiğinde beden bilgisini otomatik doldur
  useEffect(() => {
    const p = products.find(x => x.id === parseInt(productId, 10));
    setSize(p?.size || '');
  }, [productId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !quantity) return alert('Ürün ve miktar zorunludur.');
    // size backend’e gitmiyor; sadece gösterim amaçlı. İstersen ayrıca göndeririz.

    try {
      const sale = {
        productId: parseInt(productId, 10),
        quantity: parseInt(quantity, 10),
        date: new Date()
      };
      await axios.post('http://localhost:5187/sales', sale);
      alert('Satış başarılı!');
      setProductId('');
      setSize('');
      setQuantity('');
    } catch (err) {
      console.error('Satış eklenemedi:', err);
      alert(err.response?.data || 'Satış eklenemedi! Konsolu kontrol edin.');
    }
  };

  // Seçili ürüne ait tek beden -> dropdown’da tek seçenek
  const selectedProduct = products.find(p => p.id === parseInt(productId || '0', 10));
  const sizesForSelectedProduct = selectedProduct?.size ? [selectedProduct.size] : [];

  return (
    <form onSubmit={handleSubmit}>
      <h3>Satış Ekle</h3>

      <select value={productId} onChange={e => setProductId(e.target.value)} required>
        <option value="">Ürün seç</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.brand})
          </option>
        ))}
      </select>

      {/* Beden dropdown: sadece seçili ürünün bedeni */}
      <select value={size} onChange={e => setSize(e.target.value)} disabled={sizesForSelectedProduct.length === 0} required>
        <option value="">{sizesForSelectedProduct.length ? 'Beden seç' : 'Beden yok'}</option>
        {sizesForSelectedProduct.map((s, i) => (
          <option key={i} value={s}>{s}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Miktar"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        required
      />
      <button type="submit">Satışı Kaydet</button>
    </form>
  );
};

export default AddSale;
