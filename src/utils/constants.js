export const USER_ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN'
};

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden', 
  'Sports',
  'Beauty',
  'Automotive',
  'Food',
  'mobilier',
  'Other'
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    HEALTH: '/auth/health'
  },
  PRODUCTS: {
    BASE: '/products',
    PAGINATED: '/products/paginated',
    ACTIVE: '/products/active',
    SEARCH: '/products/search',
    SEMANTIC_SEARCH: '/products/semantic-search',
    CATEGORIES: '/products/categories',
    FILTER: '/products/filter',
    PRICE_RANGE: '/products/price-range',
    AVAILABLE: '/products/available'
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    PAGINATED: '/users/paginated',
    ACTIVE: '/users/active',
    SEARCH: '/users/search',
    COUNT_ACTIVE: '/users/count/active'
  }
};

export const PAGINATION_OPTIONS = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  USERNAME_MIN_LENGTH: 3,
  PRICE_MIN: 0
};