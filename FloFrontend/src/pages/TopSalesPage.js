import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/pages/TopSalesPage.css';

// Yeni eklenen fonksiyon
const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

const TopSalesPage = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopSales = async () => {
      try {
        const productRes = await axios.get('http://localhost:5187/top-selling-products');
        setTopProducts(productRes.data);

        const categoryRes = await axios.get('http://localhost:5187/top-selling-categories');
        setTopCategories(categoryRes.data);

        const brandRes = await axios.get('http://localhost:5187/top-selling-brands');
        setTopBrands(brandRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Veriler çekilemedi:', err);
        setError('Veriler yüklenirken bir sorun oluştu.');
        setLoading(false);
      }
    };
    
    fetchTopSales();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Yükleniyor...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  }

  return (
    <div className="top-sales-container">
      <h1 className="section-title">En Çok Satanlar</h1>
      
      <div className="top-sales-grid">
        {/* En Çok Satan Ürünler Tablosu */}
        <div className="top-sales-card">
          <h2 className="card-title">En Çok Satan Ürünler</h2>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Ürün Adı</th>
                <th>Marka</th>
                <th>Satış Miktarı</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{capitalize(item.name)}</td> {/* 👈 capitalize kullanıldı */}
                  <td>{capitalize(item.brand)}</td> {/* 👈 capitalize kullanıldı */}
                  <td>{item.totalQuantitySold} Adet</td>
                </tr>
              ))}
            </tbody>
          </table>
          {topProducts.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>Henüz satış verisi bulunmuyor.</p>}
        </div>

        {/* En Çok Satan Kategoriler Tablosu */}
        <div className="top-sales-card">
          <h2 className="card-title">En Çok Satan Kategoriler</h2>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Kategori</th>
                <th>Satış Miktarı</th>
              </tr>
            </thead>
            <tbody>
              {topCategories.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{capitalize(item.category)}</td> {/* 👈 capitalize kullanıldı */}
                  <td>{item.totalQuantitySold} Adet</td>
                </tr>
              ))}
            </tbody>
          </table>
          {topCategories.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>Henüz satış verisi bulunmuyor.</p>}
        </div>
        
        {/* En Çok Satan Markalar Tablosu */}
        <div className="top-sales-card">
          <h2 className="card-title">En Çok Satan Markalar</h2>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Marka</th>
                <th>Satış Miktarı</th>
              </tr>
            </thead>
            <tbody>
              {topBrands.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{capitalize(item.brand)}</td> {/* 👈 capitalize kullanıldı */}
                  <td>{item.totalQuantitySold} Adet</td>
                </tr>
              ))}
            </tbody>
          </table>
          {topBrands.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>Henüz satış verisi bulunmuyor.</p>}
        </div>
      </div>
    </div>
  );
};

export default TopSalesPage;