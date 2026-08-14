import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { Edit, Trash2 } from 'lucide-react';
import { formatRupiah } from '../../utils/currencyFormatter';
import './AdminPages.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isFeatured: boolean;
  subCategoryId: number;
  subCategory?: {
    id: number;
    name: string;
    category?: {
      id: number;
      name: string;
    }
  }
}

interface SubCategory {
  id: number;
  name: string;
  category?: { name: string };
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?page=${page}&limit=10`);
      const fetchedProducts = res.data.data || (Array.isArray(res.data) ? res.data : []);
      setProducts(fetchedProducts);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch products', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('subCategoryId', subCategoryId);
    formData.append('isFeatured', String(isFeatured));
    if (image) {
      formData.append('image', image);
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setSubCategoryId(product.subCategoryId.toString());
    setIsFeatured(product.isFeatured || false);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setSubCategoryId('');
    setIsFeatured(false);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Manage Products</h1>
      </div>

      <div className="admin-content-grid">
        <div className="form-card">
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Sub-Category</label>
              <select value={subCategoryId} onChange={e => setSubCategoryId(e.target.value)} required>
                <option value="">Select Sub-Category</option>
                {subCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.category?.name} - {c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Price</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="isFeatured" 
                checked={isFeatured} 
                onChange={e => setIsFeatured(e.target.checked)} 
                style={{ width: 'auto' }}
              />
              <label htmlFor="isFeatured" style={{ marginBottom: 0, cursor: 'pointer' }}>Set as Featured Product (Show on Home Page)</label>
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} ref={fileInputRef} />
            </div>

            <div className="form-actions">
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
              )}
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Save'} Product
              </button>
            </div>
          </form>
        </div>

        <div className="data-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Featured</th>
                <th>Sub-Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>
                    {product.imageUrl ? (
                      <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `https://catalog-14qg.onrender.com${product.imageUrl}`} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', background: '#e2e8f0', borderRadius: '6px' }}></div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.isFeatured ? '⭐ Yes' : 'No'}</td>
                  <td>{product.subCategory?.category?.name} - {product.subCategory?.name}</td>
                  <td>{formatRupiah(product.price)}</td>
                  <td className="">
                    <button className="icon-btn edit" onClick={() => handleEdit(product)}>
                      <Edit size={18} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(product.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Page {page} of {totalPages}</span>
              <button 
                className="btn-secondary" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageProducts;
