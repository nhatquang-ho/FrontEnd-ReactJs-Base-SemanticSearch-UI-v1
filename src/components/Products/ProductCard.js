import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  ShoppingCart
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  showActions = true 
}) => {
  const isActive = product.isActive !== false;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography gutterBottom variant="h6" component="div">
            {product.name}
          </Typography>
          <Chip 
            label={product.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary">
            {formatCurrency(product.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {product.stockQuantity || 0}
          </Typography>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip 
            label={isActive ? 'Active' : 'Inactive'} 
            color={isActive ? 'success' : 'error'}
            size="small"
          />
          {product.stockQuantity > 0 ? (
            <Chip label="In Stock" color="success" size="small" />
          ) : (
            <Chip label="Out of Stock" color="error" size="small" />
          )}
        </Box>
      </CardContent>

      {showActions && (
        <CardActions>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box>
              {onEdit && (
                <Tooltip title="Edit Product">
                  <IconButton size="small" onClick={() => onEdit(product)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
              {onToggleActive && (
                <Tooltip title={isActive ? 'Deactivate' : 'Activate'}>
                  <IconButton size="small" onClick={() => onToggleActive(product)}>
                    {isActive ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            {onDelete && (
              <Tooltip title="Delete Product">
                <IconButton size="small" color="error" onClick={() => onDelete(product)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default ProductCard;