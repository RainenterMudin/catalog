import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
// Public
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';

// Admin
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageSubCategories from './pages/admin/ManageSubCategories';
import ManageProducts from './pages/admin/ManageProducts';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/cms/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Admin Routes */}
          <Route path="/cms/login" element={<Login />} />
          <Route path="/cms" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/cms/categories" element={
            <ProtectedRoute>
              <ManageCategories />
            </ProtectedRoute>
          } />
          <Route path="/cms/sub-categories" element={
            <ProtectedRoute>
              <ManageSubCategories />
            </ProtectedRoute>
          } />
          <Route path="/cms/products" element={
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
