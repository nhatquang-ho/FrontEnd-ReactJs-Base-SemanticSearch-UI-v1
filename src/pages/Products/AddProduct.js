import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/Products/ProductForm';
import productService from '../../services/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (productData) => {
    try {
      setLoading(true);
      setError('');

      await productService.createProduct(productData);
      navigate('/products', { 
        state: { message: 'Product created successfully!' }
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/products" underline="hover">
          Products
        </Link>
        <Typography color="text.primary">Add Product</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Create a new product in your inventory
      </Typography>

      <Paper sx={{ p: 4 }}>
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          error={error}
        />
      </Paper>
    </Box>
  );
};

export default AddProduct;