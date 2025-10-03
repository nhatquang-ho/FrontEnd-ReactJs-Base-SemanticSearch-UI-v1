import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/Products/ProductForm';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import productService from '../../services/productService';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      setSubmitLoading(true);
      setError('');

      await productService.updateProduct(id, productData);
      navigate('/products', { 
        state: { message: 'Product updated successfully!' }
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error && !product) {
    return (
      <Box>
        <ErrorMessage message={error} />
        <Link component={RouterLink} to="/products">
          ← Back to Products
        </Link>
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/products" underline="hover">
          Products
        </Link>
        <Typography color="text.primary">Edit Product</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Update product information
      </Typography>

      <Paper sx={{ p: 4 }}>
        {product && (
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitLoading}
            error={error}
          />
        )}
      </Paper>
    </Box>
  );
};

export default EditProduct;