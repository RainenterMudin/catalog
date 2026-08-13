import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Tags, Package, LogOut } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/cms/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Catalog CMS</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/cms" className={`nav-item ${isActive('/cms')}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/cms/categories" className={`nav-item ${isActive('/cms/categories')}`}>
            <Tags size={20} />
            <span>Categories</span>
          </Link>
          <Link to="/cms/sub-categories" className={`nav-item ${isActive('/cms/sub-categories')}`}>
            <Tags size={20} />
            <span>Sub-Categories</span>
          </Link>
          <Link to="/cms/products" className={`nav-item ${isActive('/cms/products')}`}>
            <Package size={20} />
            <span>Products</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span>{user?.name}</span>
            <small>{user?.email}</small>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
