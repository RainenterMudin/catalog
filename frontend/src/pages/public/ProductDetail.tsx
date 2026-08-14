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
      <div className="product-detail-page">
        <div className="breadcrumb">
          <Link to="/products">Products</Link> / {product.subCategory?.category?.name && <span>{product.subCategory.category.name} / </span>} {product.subCategory?.name && <span>{product.subCategory.name} / </span>} <span>{product.name}</span>
        </div>
        
        <div className="product-detail-grid">
          <div className="product-detail-image">
            {product.imageUrl ? (
              <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://catalog-14qg.onrender.com${product.imageUrl}`} alt={product.name} />
            ) : (
              <div className="placeholder-image-large">No Image Available</div>
            )}
          </div>
          
          <div className="product-detail-info">
            <span className="category-tag">{product.subCategory?.name}</span>
            <h1>{product.name}</h1>
            <p className="price">{formatRupiah(Number(product.price))}</p>
            
            <div className="description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="actions">
              <button 
                className="add-to-cart-btn"
                onClick={() => {
                  const message = `Halo, saya tertarik dengan produk ${product.name}`;
                  window.open(`https://wa.me/6282130907490?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                Pesan via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetail;
