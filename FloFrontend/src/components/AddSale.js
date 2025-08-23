import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/components/AddSale.css';

const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

const AddSale = ({ onSaleAdded }) => { // onSaleAdded prop'u eklendi
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [productId, setProductId] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Ürünleri çek ve tekleştir
  useEffect(() => {
    axios.get('http://localhost:5187/products')
      .then(res => {
        const uniqueMap = {};
        res.data.forEach(p => {
          const key = `${p.name}-${p.brand}-${p.category}-${p.price}`;
          if (!uniqueMap[key]) uniqueMap[key] = { ...p };
        });
        setProducts(Object.values(uniqueMap));
      })
      .catch(err => console.error('Ürünler çekilemedi:', err));
  }, []);

  // Ürün seçildiğinde bedenleri çek
  useEffect(() => {
    if (!productId) {
      setSizes([]);
      setSelectedProduct(null);
      return;
    }

    const product = products.find(p => p.id === parseInt(productId, 10));
    setSelectedProduct(product);

    axios.get(`http://localhost:5187/products/${productId}/sizes`)
      .then(res => setSizes(res.data))
      .catch(err => console.error('Beden bilgileri çekilemedi:', err));
  }, [productId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedProduct || !size || !quantity) {
      setErrorMessage('Lütfen tüm alanları doldurun.');
      setLoading(false);
      return;
    }

    try {
      const sale = {
        name: selectedProduct.name,
        brand: selectedProduct.brand,
        category: selectedProduct.category,
        price: selectedProduct.price,
        size: size,
        quantity: parseInt(quantity, 10),
        date: new Date().toISOString(),
      };
      
      const res = await axios.post('http://localhost:5187/sales', sale);
      setSuccessMessage('Satış başarıyla kaydedildi!');
      
      // Formu temizle
      setProductId('');
      setSize('');
      setQuantity('');
      setSizes([]);
      setSelectedProduct(null);

      if(onSaleAdded) {
        onSaleAdded(); // Yeni satış eklendiğinde SaleList'i güncellemek için çağır
      }
    } catch (err) {
      console.error('Satış eklenemedi:', err);
      setErrorMessage(err.response?.data || 'Satış eklenemedi! Lütfen konsolu kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-sale-container">
      <h3 className="add-sale-title">Satış Ekle</h3>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="add-sale-form">
        <label className="form-label">Ürün Seç</label>
        <select 
          className="form-select"
          value={productId} 
          onChange={e => setProductId(e.target.value)} 
          required
        >
          <option value="">Ürün seç</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {capitalize(p.name)} ({capitalize(p.brand)})
            </option>
          ))}
        </select>

        <label className="form-label">Beden Seç</label>
        <select 
          className="form-select"
          value={size} 
          onChange={e => setSize(e.target.value)} 
          required
          disabled={!productId}
        >
          <option value="">Beden seç</option>
          {sizes.map(s => (
            <option key={s.size} value={s.size}>
              {s.size} (Stok: {s.stock})
            </option>
          ))}
        </select>

        <label className="form-label">Miktar</label>
        <input 
          className="form-input"
          type="number" 
          placeholder="Miktar" 
          value={quantity} 
          onChange={e => setQuantity(e.target.value)} 
          required 
          min="1"
        />

        <button 
          className="form-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Satışı Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default AddSale;