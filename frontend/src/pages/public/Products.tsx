import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import api from '../../services/api';
import { formatRupiah } from '../../utils/currencyFormatter';
import './Products.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  slug: string;
  subCategory?: {
    name: string;
    category?: {
      name: string;
    };
  };
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubCategory, page, search]);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      let url = `/products?page=${page}`;
      if (selectedSubCategory) {
        url += `&subCategoryId=${selectedSubCategory}`;
      } else if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`;
      }
      if (search) {
        url += `&search=${search}`;
      }
      
      const res = await api.get(url);
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.total);
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value ? Number(e.target.value) : null);
    setSelectedSubCategory(null);
    setPage(1);
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCategory(e.target.value ? Number(e.target.value) : null);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

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
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select 
              value={selectedCategory || ''} 
              onChange={handleCategoryChange}
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
              onChange={handleSubCategoryChange}
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
            <p>Showing {products.length} of {totalProducts} products</p>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://catalog-14qg.onrender.com${product.imageUrl}`} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{formatRupiah(Number(product.price))}</p>
                  <Link to={`/products/${product.slug}`} className="view-details-btn">View Details</Link>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="no-products">
                No products found matching your criteria.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="pagination-info">Page {page} of {totalPages}</span>
              <button 
                className="pagination-btn" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Products;
