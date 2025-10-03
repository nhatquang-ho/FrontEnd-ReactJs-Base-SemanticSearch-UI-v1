import { VALIDATION_RULES } from './constants';

export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.username) {
    errors.username = 'Username is required';
  } else if (formData.username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    errors.username = `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`;
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};

  if (!formData.username) {
    errors.username = 'Username is required';
  } else if (formData.username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    errors.username = `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`;
  }

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!VALIDATION_RULES.EMAIL.test(formData.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`;
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (formData.firstName && formData.firstName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.firstName = `First name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`;
  }

  if (formData.lastName && formData.lastName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.lastName = `Last name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProductForm = (formData) => {
  const errors = {};

  if (!formData.name) {
    errors.name = 'Product name is required';
  }

  if (!formData.price) {
    errors.price = 'Price is required';
  } else if (isNaN(formData.price) || parseFloat(formData.price) < VALIDATION_RULES.PRICE_MIN) {
    errors.price = 'Price must be a valid number greater than or equal to 0';
  }

  if (!formData.category) {
    errors.category = 'Category is required';
  }

  if (formData.stockQuantity !== undefined && (isNaN(formData.stockQuantity) || parseInt(formData.stockQuantity) < 0)) {
    errors.stockQuantity = 'Stock quantity must be a valid number greater than or equal to 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};