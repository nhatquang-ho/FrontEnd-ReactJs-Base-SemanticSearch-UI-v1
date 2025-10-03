import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Paper,
  InputAdornment,
  Fab
} from '@mui/material';
import { Search, Add, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/Products/ProductCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import productService from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';
import { debounce } from '../../utils/helpers';

const ProductList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    product: null,
    action: null
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      fetchProducts();
    }, 500);

    debouncedSearch();
  }, [searchQuery, selectedCategory, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      let response;

      if (searchQuery) {
        response = await productService.searchProducts(searchQuery);
        // Convert to paginated format for consistency
        setProducts(response);
        setPagination(prev => ({
          ...prev,
          totalElements: response.length,
          totalPages: Math.ceil(response.length / prev.size)
        }));
      } else {
        response = await productService.getFilteredProducts({
          page: pagination.page,
          size: pagination.size,
          category: selectedCategory || undefined
        });

        setProducts(response.content || response);
        setPagination(prev => ({
          ...prev,
          totalElements: response.totalElements || response.length,
          totalPages: response.totalPages || Math.ceil(response.length / prev.size)
        }));
      }
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDelete = (product) => {
    setConfirmDialog({
      open: true,
      product,
      action: 'delete'
    });
  };

  const handleToggleActive = (product) => {
    setConfirmDialog({
      open: true,
      product,
      action: 'toggle'
    });
  };

  const confirmAction = async () => {
    const { product, action } = confirmDialog;

    try {
      if (action === 'delete') {
        await productService.deleteProduct(product.id);
      } else if (action === 'toggle') {
        if (product.isActive) {
          // If currently active, we would deactivate (soft delete)
          await productService.deleteProduct(product.id);
        } else {
          // If currently inactive, restore it
          await productService.restoreProduct(product.id);
        }
      }

      fetchProducts();
    } catch (error) {
      setError(`Failed to ${action} product`);
    } finally {
      setConfirmDialog({ open: false, product: null, action: null });
    }
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage - 1 }));
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Products ({pagination.totalElements})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/products/add')}
        >
          Add Product
        </Button>
      </Box>

      <ErrorMessage message={error} />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {searchQuery || selectedCategory 
              ? 'Try adjusting your search criteria' 
              : 'Get started by adding your first product'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/products/add')}
            sx={{ mt: 2 }}
          >
            Add Product
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add product"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/products/add')}
      >
        <Add />
      </Fab>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, product: null, action: null })}
        onConfirm={confirmAction}
        title={confirmDialog.action === 'delete' ? 'Delete Product' : 'Toggle Product Status'}
        message={
          confirmDialog.action === 'delete'
            ? `Are you sure you want to delete "${confirmDialog.product?.name}"? This action will deactivate the product.`
            : `Are you sure you want to ${confirmDialog.product?.isActive ? 'deactivate' : 'activate'} "${confirmDialog.product?.name}"?`
        }
        confirmText={confirmDialog.action === 'delete' ? 'Delete' : 'Confirm'}
        severity={confirmDialog.action === 'delete' ? 'error' : 'warning'}
      />
    </Box>
  );
};

export default ProductList;