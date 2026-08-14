import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import api from '../../services/api';
import { formatRupiah } from '../../utils/currencyFormatter';
import './ProductDetail.css';

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

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <PublicLayout><div className="loading">Loading...</div></PublicLayout>;
  if (!product) return <PublicLayout><div className="error">Product not found.</div></PublicLayout>;

  return (
    <PublicLayout>
      <div className="pd-page">
        <div className="pd-breadcrumb">
          <Link to="/products">Products</Link> / {product.subCategory?.category?.name && <span>{product.subCategory.category.name} / </span>} {product.subCategory?.name && <span>{product.subCategory.name} / </span>} <span>{product.name}</span>
        </div>
        
        <div className="pd-card">
          <div className="pd-main-grid">
            
            {/* Left Image Section */}
            <div className="pd-image-section">
              <div className="pd-badge">🌿 BESTSELLER</div>
              {product.imageUrl ? (
                <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://catalog-14qg.onrender.com${product.imageUrl}`} alt={product.name} className="pd-main-img" />
              ) : (
                <div className="pd-placeholder-img">No Image</div>
              )}
              
              <div className="pd-handmade-box">
                <span className="pd-icon-large">🤲</span>
                <div className="pd-box-text">
                  <strong>Handmade with love</strong>
                  <p>Every piece is carefully crafted by skilled artisans</p>
                </div>
              </div>
            </div>

            {/* Right Info Section */}
            <div className="pd-info-section">
              <div className="pd-collection-tag">
                <span className="pd-tag-icon">🍃</span> CURATED COLLECTION
              </div>
              
              <h1 className="pd-title">{product.name}</h1>
              
              <div className="pd-description">
                <p>{product.description}</p>
              </div>
              
              <div className="pd-icons-row">
                <div className="pd-icon-item">
                  <span className="pd-icon-emoji">🧶</span>
                  <p>100% Natural<br/>Yarn</p>
                </div>
                <div className="pd-icon-item">
                  <span className="pd-icon-emoji">🤲</span>
                  <p>Handmade<br/>with Care</p>
                </div>
                <div className="pd-icon-item">
                  <span className="pd-icon-emoji">🌱</span>
                  <p>Sustainable<br/>& Ethical</p>
                </div>
              </div>
              
              <div className="pd-price-row">
                <span className="pd-price">{formatRupiah(Number(product.price))}</span>
                <span className="pd-heart">♡</span>
              </div>
              
              <button 
                className="pd-action-btn"
                onClick={() => {
                  const message = `Halo, saya tertarik dengan produk ${product.name}`;
                  window.open(`https://wa.me/6282130907490?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                PESAN VIA WHATSAPP
              </button>
              
              <p className="pd-gift-note">🎁 Beautifully wrapped, perfect for gifting</p>
            </div>
            
          </div>
          
          {/* Footer Features */}
          <div className="pd-footer-grid">
            <div className="pd-footer-item">
              <span className="pd-footer-icon">🧺</span>
              <div className="pd-footer-text">
                <strong>Curated Collection</strong>
                <p>Handpicked quality pieces</p>
              </div>
            </div>
            <div className="pd-footer-item">
              <span className="pd-footer-icon">⭐</span>
              <div className="pd-footer-text">
                <strong>Premium Quality</strong>
                <p>Made to last for years</p>
              </div>
            </div>
            <div className="pd-footer-item">
              <span className="pd-footer-icon">🧶</span>
              <div className="pd-footer-text">
                <strong>Artisan Crafted</strong>
                <p>By skilled hands with passion</p>
              </div>
            </div>
            <div className="pd-footer-item">
              <span className="pd-footer-icon">🎀</span>
              <div className="pd-footer-text">
                <strong>Thoughtful Packaging</strong>
                <p>Ready to gift with love</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetail;
