import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { Package, Tags, Layers } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSubCategories: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your CMS Dashboard</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Package size={20} color="#64748b" />
            <h3 style={{ margin: 0 }}>Total Products</h3>
          </div>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Tags size={20} color="#64748b" />
            <h3 style={{ margin: 0 }}>Total Categories</h3>
          </div>
          <p className="stat-value">{stats.totalCategories}</p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Layers size={20} color="#64748b" />
            <h3 style={{ margin: 0 }}>Total Sub-Categories</h3>
          </div>
          <p className="stat-value">{stats.totalSubCategories}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
