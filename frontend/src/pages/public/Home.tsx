import React, { useEffect, useState, useRef } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const scrollAmount = firstChild ? firstChild.clientWidth + 24 : 320; // card width + gap (1.5rem = 24px)
      const newScrollPosition = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
    }
  };

  const scrollToItem = (index: number) => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const scrollAmount = firstChild ? firstChild.clientWidth + 24 : 320;
      scrollRef.current.scrollTo({ left: index * scrollAmount, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const scrollAmount = firstChild ? firstChild.clientWidth + 24 : 320;
      const index = Math.round(scrollRef.current.scrollLeft / scrollAmount);
      setActiveIndex(index);
    }
  };

 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?isFeatured=true');
        const fetchedProducts = res.data.data || (Array.isArray(res.data) ? res.data : []);
        let displayProducts = [...fetchedProducts];
        if (displayProducts.length > 0 && displayProducts.length < 5) {
          while (displayProducts.length < 5) {
            displayProducts = [...displayProducts, ...fetchedProducts];
          }
        }
        setFeaturedProducts(displayProducts);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <PublicLayout>
      <section className="hero">
        <div className="hero-decor decor-1">♥</div>
        <div className="hero-decor decor-2">♥</div>
        <div className="hero-decor decor-3">♥</div>
        <div className="hero-decor decor-4">♥</div>
        <div className="hero-content">
          <h1>Handcrafted With Love</h1>
          <p>Explore our curated collection of the best handmade knitting items carefully crafted just for you.</p>
          <Link to="/products" className="hero-btn">Shop Now</Link>
        </div>
        <div className="custom-shape-divider-bottom">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C79.86,122.9,152.9,111.4,221.39,86.44Z" className="shape-fill"></path>
            </svg>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="carousel-wrapper">
            <button className="carousel-arrow-btn left" onClick={() => scroll('left')}>&#8249;</button>
            <div className="carousel-track" ref={scrollRef} onScroll={handleScroll}>
              {featuredProducts.map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="carousel-item">
                  <div className="product-card">
                    <div className="product-badge">
                      🌿 BESTSELLER
                    </div>
                    <div className="product-image">
                      {product.imageUrl ? (
                        <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://catalog-14qg.onrender.com${product.imageUrl}`} alt={product.name} />
                      ) : (
                        <div className="placeholder-image">No Image</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="serif-title">{product.name}</h3>
                      <div className="product-features">
                        <span>🧶 Handmade</span>
                        <span>✨ Premium Yarn</span>
                      </div>
                      <div className="price-action-row">
                        <p className="price">{formatRupiah(Number(product.price))}</p>
                      </div>
                      <Link to={`/products/${product.slug}`} className="view-details-btn action-btn">
                        <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        VIEW DETAILS
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-arrow-btn right" onClick={() => scroll('right')}>&#8250;</button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
