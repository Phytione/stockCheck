import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSale = () => {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [productId, setProductId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5187/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!productId) return setVariants([]);
    axios.get(`http://localhost:5187/productvariants/${productId}`)
      .then(res => setVariants(res.data))
      .catch(err => console.error(err));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!variantId || !quantity) return alert('Tüm alanları doldurun');

    try {
      const sale = { productVariantId: parseInt(variantId), quantity: parseInt(quantity), date: new Date() };
      const res = await axios.post('http://localhost:5187/sales', sale);
      alert('Satış başarılı!');
      setProductId('');
      setVariantId('');
      setQuantity('');
    } catch (err) {
      console.error('Satış eklenemedi:', err);
      alert(err.response?.data || 'Satış eklenemedi! Konsolu kontrol edin.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Satış Ekle (Beden Seçmeli)</h3>
      <select value={productId} onChange={e => setProductId(e.target.value)} required>
        <option value="">Ürün seç</option>
        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select value={variantId} onChange={e => setVariantId(e.target.value)} required>
        <option value="">Beden seç</option>
        {variants.map(v => (
          <option key={v.id} value={v.id}>{v.size} (Stok: {v.stock})</option>
        ))}
      </select>
      <input type="number" placeholder="Miktar" value={quantity} onChange={e => setQuantity(e.target.value)} required />
      <button type="submit">Satışı Kaydet</button>
    </form>
  );
};

export default AddSale;
