import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { Search, Clear, Psychology } from '@mui/icons-material';
import ProductCard from '../../components/Products/ProductCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import productService from '../../services/productService';
import { debounce } from '../../utils/helpers';

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const performSemanticSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) return;

      try {
        setLoading(true);
        setError('');

        const results = await productService.semanticSearch(query);
        setSearchResults(results);
        setHasSearched(true);

        // Add to recent searches (keep last 5)
        setRecentSearches(prev => {
          const updated = [query, ...prev.filter(s => s !== query)];
          return updated.slice(0, 5);
        });
      } catch (error) {
        setError('Failed to perform semantic search');
        console.error('Semantic search error:', error);
      } finally {
        setLoading(false);
      }
    }, 800),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      performSemanticSearch(query);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSemanticSearch(searchQuery);
    }
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    performSemanticSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setError('');
  };

  const exampleSearches = [
    'comfortable ergonomic chair',
    'waterproof outdoor equipment',
    'professional business furniture',
    'eco-friendly kitchen products',
    'gaming accessories for desk'
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Semantic Product Search
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Use natural language to find products that match your needs using AI-powered search
      </Typography>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSearchSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Describe what you're looking for... (e.g., 'durable office chair for long hours')"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Psychology color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={handleClearSearch}
                        startIcon={<Clear />}
                      >
                        Clear
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Search />}
                disabled={!searchQuery.trim() || loading}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Example Searches */}
        {!hasSearched && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Try these example searches:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exampleSearches.map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  variant="outlined"
                  clickable
                  onClick={() => handleRecentSearchClick(example)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Recent searches:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {recentSearches.map((search, index) => (
                <Chip
                  key={index}
                  label={search}
                  variant="filled"
                  clickable
                  onClick={() => handleRecentSearchClick(search)}
                  size="small"
                  color="primary"
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      <ErrorMessage message={error} />

      {/* Search Results */}
      {loading && <LoadingSpinner message="Searching products..." />}

      {hasSearched && !loading && (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Results ({searchResults.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Results are ordered by semantic similarity to your query
            </Typography>
            <Divider />
          </Box>

          {searchResults.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try rephrasing your search or using different keywords. The semantic search understands natural language, so describe what you need in your own words.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {searchResults.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard
                    product={product}
                    showActions={false}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Info Alert */}
      {!hasSearched && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>How semantic search works:</strong> Our AI-powered search understands the meaning 
            behind your search query, not just matching keywords. Describe what you need in natural 
            language, and we'll find products that best match your requirements based on their descriptions 
            and characteristics.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ProductSearch;