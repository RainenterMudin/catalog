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

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If reached the end, scroll back to beginning
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 3000); // 3 seconds interval

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?isFeatured=true');
        const fetchedProducts = res.data.data || (Array.isArray(res.data) ? res.data : []);
        setFeaturedProducts(fetchedProducts); // Show all featured products in carousel
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
          <div className="carousel-wrapper">
            <div className="carousel-track" ref={scrollRef} onScroll={handleScroll}>
              {featuredProducts.map(product => (
                <div key={product.id} className="carousel-item">
                  <div className="product-card">
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
                </div>
              ))}
            </div>
            
            <div className="carousel-controls">
              <div className="carousel-arrows">
                <button className="carousel-arrow-btn" onClick={() => scroll('left')}>&#8249;</button>
                <button className="carousel-arrow-btn" onClick={() => scroll('right')}>&#8250;</button>
              </div>
              <div className="carousel-dots">
                {featuredProducts.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`carousel-dot ${activeIndex === idx ? 'active' : ''}`}
                    onClick={() => scrollToItem(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
