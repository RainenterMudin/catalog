import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import api from '../../services/api';
import './ProductDetail.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: {
    name: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <PublicLayout><div className="loading">Loading...</div></PublicLayout>;
  if (!product) return <PublicLayout><div className="error">Product not found.</div></PublicLayout>;

  return (
    <PublicLayout>
      <div className="product-detail-page">
        <div className="breadcrumb">
          <Link to="/products">Products</Link> / <span>{product.category?.name}</span> / <span>{product.name}</span>
        </div>
        
        <div className="product-detail-grid">
          <div className="product-detail-image">
            {product.imageUrl ? (
              <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
            ) : (
              <div className="placeholder-image-large">No Image Available</div>
            )}
          </div>
          
          <div className="product-detail-info">
            <span className="category-tag">{product.category?.name}</span>
            <h1>{product.name}</h1>
            <p className="price">${Number(product.price).toFixed(2)}</p>
            
            <div className="description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="actions">
              <button className="add-to-cart-btn">Interested? Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetail;
