import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/components/StockList.css'; 

const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

const StockList = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState(''); // Arama terimi için yeni state
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5187/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5187/sales')
      .then(res => setSales(res.data))
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const getSoldQuantity = (productId) =>
    sales.filter(s => s.productId === productId)
         .reduce((sum, s) => sum + s.quantity, 0);

  // Filtreleme ve arama mantığı güncellendi
  const filteredProducts = products.filter(p => {
    const matchesCategory = category === 'All' || p.category.toLowerCase() === category.toLowerCase();
    const matchesSearchTerm = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  const groupedProducts = {};
  filteredProducts.forEach(p => {
    const key = `${p.name.trim().toLowerCase()}-${p.brand.trim().toLowerCase()}-${p.category.trim().toLowerCase()}-${p.price}`;
    
    if (!groupedProducts[key]) {
      groupedProducts[key] = {
        ...p,
        variants: []
      };
    }
    
    const sold = getSoldQuantity(p.id);
    groupedProducts[key].variants.push({
      id: p.id,
      size: p.size,
      stock: Math.max(p.stock - sold, 0)
    });
  });

  const uniqueProducts = Object.values(groupedProducts);
  const maxStock = Math.max(...products.map(p => p.stock), 20);

  return (
    <div className="stocks-page-container">
      <h1 className="section-title">Stok Durumu</h1>

      <div className="filter-and-search-container">
        {/* Kategori filtreleme */}
        <div className="filter-group">
          <label>Kategori:</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{capitalize(c)}</option>)}
          </select>
        </div>
        
        {/* Arama çubuğu */}
        <div className="search-group">
          <label>Ara:</label>
          <input 
            type="text"
            placeholder="Ürün adı, marka, kategori..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="stock-cards">
        {uniqueProducts.map(product => {
          const selectedSize = selectedSizes[product.name] || product.variants[0]?.size;
          const currentVariant = product.variants.find(v => v.size === selectedSize);

          const percent = currentVariant ? (currentVariant.stock / maxStock) * 100 : 0;
          
          let progressClassName = 'progress-high';
          if (percent < 20) {
            progressClassName = 'progress-low';
          } else if (percent < 50) {
            progressClassName = 'progress-medium';
          }

          return (
            <div key={`${product.name}-${product.brand}-${product.category}`} className="stock-card">
              <h3>{capitalize(product.name)}</h3>
              <div className="product-details">
                <p>Marka: {capitalize(product.brand) || "Bilinmiyor"}</p>
                <p>Kategori: {capitalize(product.category)}</p>
                <p>Fiyat: {product.price} TL</p>
              </div>

              <div className="size-buttons">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() =>
                      setSelectedSizes(prev => ({ ...prev, [product.name]: v.size }))
                    }
                    className={`size-button ${selectedSize === v.size ? 'selected' : ''}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>

              <div className="progress-bar-container">
                <div 
                  className={`progress-bar ${progressClassName}`} 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <p>{currentVariant?.stock ?? 0} adet stokta</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockList;