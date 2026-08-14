import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import api from '../../services/api';
import { formatRupiah } from '../../utils/currencyFormatter';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
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
          <div className="carousel-container">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: true,
              }}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              navigation={true}
              className="featured-swiper"
            >
              {featuredProducts.map(product => (
                <SwiperSlide key={product.id} className="swiper-slide-custom">
                  <div className="product-card carousel-card">
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
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
