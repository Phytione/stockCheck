import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const SalesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5187/sales/summary')
      .then(res => {
        // API’den gelen quantity’yi totalSold’a çeviriyoruz
        const chartData = res.data.map(item => ({
          productId: `Ürün ${item.productId}`,
          totalSold: item.quantity
        }));
        setData(chartData);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2>Ürün Bazlı Satış Grafiği</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="productId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSold" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
