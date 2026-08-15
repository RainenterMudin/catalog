import React from 'react';
import { Link } from 'react-router-dom';
import './PublicLayout.css';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="public-layout">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand logo-brand">
            <img src={logoImg} alt="Nero Stitchery Logo" className="logo-img" />
            <span className="logo-text">Nero Stitchery</span>
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
        <p>&copy; {new Date().getFullYear()} Nero Stitchery. 100% Handmade with love.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
