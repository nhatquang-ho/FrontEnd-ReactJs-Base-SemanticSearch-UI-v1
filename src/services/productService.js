import api from './api';

const productService = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get products with pagination
  getProductsPaginated: async (page = 0, size = 20, sort = null) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (sort) params.append('sort', sort);

    const response = await api.get(`/products/paginated?${params.toString()}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get active products
  getActiveProducts: async () => {
    const response = await api.get('/products/active');
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Search products by name
  searchProducts: async (name) => {
    const response = await api.get(`/products/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  // Get products by price range
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    const response = await api.get(`/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return response.data;
  },

  // Get available products (by minimum stock)
  getAvailableProducts: async (minStock = 0) => {
    const response = await api.get(`/products/available?minStock=${minStock}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Get filtered products
  getFilteredProducts: async (filters) => {
    const params = new URLSearchParams();
    if (filters.page !== undefined) params.append('page', filters.page);
    if (filters.size !== undefined) params.append('size', filters.size);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice);

    const response = await api.get(`/products/filter?${params.toString()}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (soft delete)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Restore product
  restoreProduct: async (id) => {
    const response = await api.patch(`/products/${id}/restore`);
    return response.data;
  },

  // Semantic search - POST with query in body
  semanticSearch: async (query) => {
    const response = await api.post('/products/semantic-search', { query });
    return response.data;
  }
};

export default productService;