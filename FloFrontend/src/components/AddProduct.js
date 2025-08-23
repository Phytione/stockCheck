import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/components/AddProduct.css';

const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

const AddProduct = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    size: '',
    price: '',
    category: '',
    stock: ''
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Bu iki değişken geri geldi
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5187/products')
      .then(res => {
        const uniqueBrands = [...new Set(res.data.map(p => p.brand))];
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setBrands(uniqueBrands);
        setCategories(uniqueCategories);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!product.name || !product.brand || !product.category || !product.size || !product.price || !product.stock) {
      setErrorMessage('Lütfen tüm alanları doldurun.');
      setLoading(false);
      return;
    }

    try {
      const formattedProduct = {
        ...product,
        name: product.name.trim().toLowerCase(),
        brand: product.brand.trim().toLowerCase(),
        category: product.category.trim().toLowerCase(),
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10),
      };

      await axios.post('http://localhost:5187/products', formattedProduct);
      setSuccessMessage('Ürün başarıyla eklendi!');
      
      setProduct({
        name: '',
        brand: '',
        size: '',
        price: '',
        category: '',
        stock: ''
      });
      
      if (!brands.includes(formattedProduct.brand)) {
        setBrands(prevBrands => [...prevBrands, formattedProduct.brand]);
      }
      if (!categories.includes(formattedProduct.category)) {
        setCategories(prevCategories => [...prevCategories, formattedProduct.category]);
      }
      
      if (onProductAdded) {
        onProductAdded();
      }

    } catch (err) {
      console.error('Ürün eklenirken bir hata oluştu:', err);
      setErrorMessage('Ürün eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h3 className="add-product-title">Yeni Ürün Ekle</h3>
      {/* Mesaj alanları güncellendi */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <form onSubmit={handleSubmit} className="add-product-form">
        <input 
          className="form-input"
          placeholder="Ürün Adı" 
          type="text" 
          name="name" 
          value={product.name} 
          onChange={handleChange} 
          required 
        />
        <input 
          className="form-input"
          placeholder="Marka Seçin veya Yazın" 
          type="text" 
          name="brand" 
          list="brand-list" 
          value={product.brand} 
          onChange={handleChange} 
          required 
        />
        <datalist id="brand-list">
          {brands.map(brand => (
            <option key={brand} value={brand}>{capitalize(brand)}</option>
          ))}
        </datalist>
        <input 
          className="form-input"
          placeholder="Beden" 
          type="text" 
          name="size" 
          value={product.size} 
          onChange={handleChange} 
          required 
        />
        <input 
          className="form-input"
          placeholder="Fiyat (TL)" 
          type="number" 
          name="price" 
          step="0.01"
          value={product.price} 
          onChange={handleChange} 
          required 
        />
        <input 
          className="form-input"
          placeholder="Kategori Seçin veya Yazın" 
          type="text" 
          name="category" 
          list="category-list" 
          value={product.category} 
          onChange={handleChange} 
          required 
        />
        <datalist id="category-list">
          {categories.map(category => (
            <option key={category} value={category}>{capitalize(category)}</option>
          ))}
        </datalist>
        <input 
          className="form-input"
          placeholder="Stok Adedi" 
          type="number" 
          name="stock" 
          value={product.stock} 
          onChange={handleChange} 
          required 
        />
        <button type="submit" className="form-button">
          {loading ? 'Ekleniyor...' : 'Ekle'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;