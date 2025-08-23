import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/components/SaleList.css'; // Yeni CSS dosyasını dahil ediyoruz

const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

const SaleList = ({ onUpdate }) => { // onUpdate prop'u eklendi
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:5187/sales');
      setSales(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Satışlar alınamadı:', err);
      setError('Satışlar yüklenirken bir sorun oluştu.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [onUpdate]); // onUpdate prop'u değiştiğinde listeyi yenile

  if (loading) {
    return <div className="info-message">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (sales.length === 0) {
    return <div className="info-message">Henüz hiç satış yapılmamış.</div>;
  }

  return (
    <div className="sale-list-container">
      <h3 className="list-title">Yapılan Satışlar</h3>
      <table className="sale-table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Ürün Adı</th>
            <th>Marka</th>
            <th>Kategori</th>
            <th>Beden</th>
            <th>Miktar</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td>{new Date(s.date).toLocaleString()}</td>
              <td>{capitalize(s.name)}</td>
              <td>{capitalize(s.brand)}</td>
              <td>{capitalize(s.category)}</td>
              <td>{s.size}</td>
              <td>{s.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SaleList;