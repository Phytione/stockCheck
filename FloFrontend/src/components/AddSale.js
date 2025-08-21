import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSale = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Ürünleri çekiyoruz, dropdown için
    axios.get('http://localhost:5187/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedProduct = products.find(p => p.id === parseInt(productId));
    if (!selectedProduct) {
      alert('Lütfen bir ürün seçin.');
      return;
    }

    if (quantity <= 0) {
      alert('Miktar 0 veya negatif olamaz.');
      return;
    }

    if (quantity > selectedProduct.stock) {
      alert(`Mevcut stok: ${selectedProduct.stock}. Bu miktarda satış ekleyemezsiniz.`);
      return;
    }

    try {
      const sale = { productId: parseInt(productId), quantity: parseInt(quantity), date: new Date() };
      const res = await axios.post('http://localhost:5187/sales', sale);
      console.log('Satış eklendi:', res.data);
      setQuantity('');
      setProductId('');
    } catch (err) {
      console.error('Satış eklenemedi:', err);
      alert('Satış eklenemedi! Konsolu kontrol edin.');
    }
  };

  return (
    <div>
      <h2>Satış Ekle</h2>
      <form onSubmit={handleSubmit}>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
          <option value="">Ürün seç</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Miktar"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Satışı Kaydet</button>
      </form>
    </div>
  );
};

export default AddSale;
