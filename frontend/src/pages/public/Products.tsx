import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import api from '../../services/api';
import { formatRupiah } from '../../utils/currencyFormatter';
import './Products.css';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubCategory]);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      let url = '/products';
      if (selectedSubCategory) {
        url = `/products?subCategoryId=${selectedSubCategory}`;
      } else if (selectedCategory) {
        url = `/products?categoryId=${selectedCategory}`;
      }
      
      const res = await api.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await api.get('/subcategories');
      setSubCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch sub-categories', error);
    }
  };

  const filteredSubCategories = selectedCategory 
    ? subCategories.filter(sc => sc.categoryId === selectedCategory)
    : [];

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PublicLayout>
      <div className="products-page">
        <aside className="filters-sidebar">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <label>Search</label>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select 
              value={selectedCategory || ''} 
              onChange={(e) => {
                setSelectedCategory(e.target.value ? Number(e.target.value) : null);
                setSelectedSubCategory(null); // Reset sub-category when category changes
              }}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sub-Category</label>
            <select 
              value={selectedSubCategory || ''} 
              onChange={(e) => setSelectedSubCategory(e.target.value ? Number(e.target.value) : null)}
              disabled={!selectedCategory}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit', backgroundColor: !selectedCategory ? '#f1f5f9' : 'white' }}
            >
              <option value="">All Sub-Categories</option>
              {filteredSubCategories.map(subCat => (
                <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
              ))}
            </select>
          </div>
        </aside>

        <div className="products-content">
          <div className="content-header">
            <h1>Our Products</h1>
            <p>Showing {filteredProducts.length} products</p>
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.imageUrl ? (
                    <img src={`https://catalog-14qg.onrender.com${product.imageUrl}`} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{formatRupiah(product.price)}</p>
                  <Link to={`/products/${product.id}`} className="view-btn">View Details</Link>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="no-products">
                No products found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Products;
