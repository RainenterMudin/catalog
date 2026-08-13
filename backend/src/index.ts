import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import subCategoryRoutes from './routes/subCategoryRoutes';
import productRoutes from './routes/productRoutes';
import statsRoutes from './routes/statsRoutes';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stats', statsRoutes);

// Simple Route
app.get('/', (req, res) => {
  res.send('Catalog API is running');
});

// Health check for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
