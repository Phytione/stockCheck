import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/components/CategoryBrandCharts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

const CategoryBrandCharts = ({ topCategories, topBrands }) => {

  const categoryData = {
    labels: topCategories.map(item => capitalize(item.category)),
    datasets: [
      {
        label: 'Satış Yüzdesi',
        data: topCategories.map(item => item.totalQuantitySold),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const brandData = {
    labels: topBrands.map(item => capitalize(item.brand)),
    datasets: [
      {
        label: 'Satış Yüzdesi',
        data: topBrands.map(item => item.totalQuantitySold),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const data = tooltipItem.dataset.data;
            const total = data.reduce((sum, current) => sum + current, 0);
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <h3 className="chart-title">En Çok Satan Kategoriler</h3>
        <Doughnut data={categoryData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'En Çok Satan Kategoriler'}}}} />
      </div>
      <div className="chart-wrapper">
        <h3 className="chart-title">En Çok Satan Markalar</h3>
        <Doughnut data={brandData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'En Çok Satan Markalar'}}}} />
      </div>
    </div>
  );
};

export default CategoryBrandCharts;