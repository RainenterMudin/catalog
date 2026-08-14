import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Tags, Package, LogOut, Menu, X, Globe } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="admin-layout">
      <div className="mobile-topbar-wrapper">
        <div className="mobile-topbar">
          <h2>Catalog CMS</h2>
          <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <aside className={`admin-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header desktop-only">
          <h2>Catalog CMS</h2>
        </div>
        <nav className="sidebar-nav" onClick={() => setIsMenuOpen(false)}>
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
          <div className="nav-divider" style={{ margin: '1rem 0', borderTop: '1px solid #e2e8f0' }}></div>
          <Link to="/" className="nav-item">
            <Globe size={20} />
            <span>View Website</span>
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
