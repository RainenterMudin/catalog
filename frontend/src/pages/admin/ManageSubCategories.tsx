import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { Edit, Trash2 } from 'lucide-react';
import './AdminPages.css';

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  category?: Category;
}

const ManageSubCategories = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const res = await api.get('/subcategories');
      setSubCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch sub-categories', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/subcategories/${editingId}`, { name, description, categoryId });
      } else {
        await api.post('/subcategories', { name, description, categoryId });
      }
      setName('');
      setDescription('');
      setCategoryId('');
      setEditingId(null);
      fetchSubCategories();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to save sub-category';
      alert(errorMessage);
      console.error('Failed to save sub-category', error);
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingId(subCategory.id);
    setName(subCategory.name);
    setDescription(subCategory.description || '');
    setCategoryId(subCategory.categoryId.toString());
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      try {
        await api.delete(`/subcategories/${id}`);
        fetchSubCategories();
      } catch (error) {
        console.error('Failed to delete sub-category', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Manage Sub-Categories</h1>
      </div>

      <div className="admin-content-grid">
        <div className="form-card">
          <h3>{editingId ? 'Edit Sub-Category' : 'Add New Sub-Category'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Parent Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Sub-Category Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="form-actions">
              {editingId && (
                <button type="button" className="btn-secondary" onClick={() => {
                  setEditingId(null);
                  setName('');
                  setDescription('');
                  setCategoryId('');
                }}>Cancel</button>
              )}
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Save'} Sub-Category
              </button>
            </div>
          </form>
        </div>

        <div className="data-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((subCategory, index) => (
                <tr key={subCategory.id}>
                  <td>{index + 1}</td>
                  <td>{subCategory.category?.name}</td>
                  <td>{subCategory.name}</td>
                  <td>{subCategory.description}</td>
                  <td className="">
                    <button className="icon-btn edit" onClick={() => handleEdit(subCategory)}>
                      <Edit size={18} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(subCategory.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {subCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">No sub-categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageSubCategories;
