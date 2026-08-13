import React from 'react';
import { Link } from 'react-router-dom';
import './PublicLayout.css';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();

  return (
    <div className="public-layout">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            ViteCatalog
          </Link>
          <nav className="navbar-nav">
            <Link to="/">Home</Link>
            <Link to="/products">All Products</Link>
            {/* <Link to="/cms" className="login-btn">Admin CMS</Link> */}
          </nav>
        </div>
      </header>
      <main className="public-main">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ViteCatalog. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
