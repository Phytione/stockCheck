import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CategoryBrandCharts from '../components/CategoryBrandCharts';
import '../styles/pages/TopSalesPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
        const [productRes, categoryRes, brandRes] = await Promise.all([
          axios.get('http://localhost:5187/top-selling-products'),
          axios.get('http://localhost:5187/top-selling-categories'),
          axios.get('http://localhost:5187/top-selling-brands')
        ]);

        setTopProducts(productRes.data);
        setTopCategories(categoryRes.data);
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

  const chartDataProducts = {
    labels: topProducts.slice(0, 10).map(item => `${capitalize(item.name)} (${capitalize(item.brand)})`),
    datasets: [
      {
        label: 'Satılan Adet',
        data: topProducts.slice(0, 10).map(item => item.totalQuantitySold),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'En Çok Satan 10 Ürün',
        font: { size: 18, weight: 'bold' }
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Satılan Adet' } },
      x: { title: { display: true, text: 'Ürün' } }
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="top-sales-page-container">
      <h1 className="section-title">Satış Raporları</h1>
      
      <div className="chart-container">
        {topProducts.length > 0 ? (
          <Bar data={chartDataProducts} options={chartOptions} />
        ) : (
          <p className="no-data-message">En çok satan ürün verisi bulunamadı.</p>
        )}
      </div>

      <CategoryBrandCharts topCategories={topCategories} topBrands={topBrands} />

      <h2 className="table-title">Tüm Ürünlerin Satış Detayları</h2>
      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Ürün Adı</th>
              <th>Satış Miktarı</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{capitalize(item.name)} ({capitalize(item.brand)})</td>
                  <td>{item.totalQuantitySold} Adet</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">Veri bulunmuyor.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSalesPage;