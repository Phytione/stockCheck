import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/components/ProductList.css';

// Metinleri düzgün hale getiren yardımcı fonksiyon
const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

const ProductList = ({ onUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5187/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Ürünler alınamadı:', err);
      setError('Ürünler yüklenirken bir sorun oluştu.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [onUpdate]);

  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:5187/products/${id}`);
        // Ürün silindikten sonra listeyi otomatik olarak güncelle
        fetchProducts(); 
      } catch (err) {
        console.error('Ürün silinemedi:', err);
        alert('Ürün silinemedi! Lütfen konsolu kontrol edin.');
      }
    }
  };

  if (loading) {
    return <div className="info-message">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="info-message">Henüz hiç ürün eklenmemiş.</div>;
  }

  return (
    <div className="product-list-container">
      <h3 className="list-title">Mevcut Ürünler</h3>
      <table className="product-table">
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Marka</th>
            <th>Kategori</th>
            <th>Beden</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>Eylemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{capitalize(p.name)}</td>
              <td>{capitalize(p.brand)}</td>
              <td>{capitalize(p.category)}</td>
              <td>{p.size}</td>
              <td>{p.price}₺</td>
              <td>{p.stock}</td>
              <td>
                <button 
                  className="delete-button" 
                  onClick={() => handleDelete(p.id)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;