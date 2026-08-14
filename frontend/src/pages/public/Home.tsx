import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import api from '../../services/api';
import { formatRupiah } from '../../utils/currencyFormatter';
import './Home.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  slug: string;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?isFeatured=true');
        const fetchedProducts = res.data.data || (Array.isArray(res.data) ? res.data : []);
        setFeaturedProducts(fetchedProducts.slice(0, 4)); // Show up to 4 featured products
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <PublicLayout>
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Premium Products</h1>
          <p>Explore our curated collection of the best items carefully selected just for you.</p>
          <Link to="/products" className="hero-btn">Shop Now</Link>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="product-grid">
            {featuredProducts.map(product => (
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
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
