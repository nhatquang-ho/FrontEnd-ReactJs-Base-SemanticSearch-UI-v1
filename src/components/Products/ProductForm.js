import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import { validateProductForm } from '../../utils/validation';
import ErrorMessage from '../Common/ErrorMessage';
import productService from '../../services/productService';

const ProductForm = ({ 
  product = null, 
  onSubmit, 
  onCancel, 
  loading, 
  error 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    ...product
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      // Merge API categories with default categories
      const allCategories = [...new Set([...PRODUCT_CATEGORIES, ...data])];
      setCategories(allCategories);
    } catch (error) {
      // Fallback to default categories
      setCategories(PRODUCT_CATEGORIES);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Convert price and stockQuantity to numbers
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0
    };

    onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="name"
            label="Product Name"
            value={formData.name}
            onChange={handleChange}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!validationErrors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {validationErrors.category && (
              <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                {validationErrors.category}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={!!validationErrors.description}
            helperText={validationErrors.description}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!validationErrors.price}
            helperText={validationErrors.price}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="stockQuantity"
            label="Stock Quantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            error={!!validationErrors.stockQuantity}
            helperText={validationErrors.stockQuantity}
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;