import api from './api';

const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get users with pagination (admin only)
  getUsersPaginated: async (page = 0, size = 20, sort = null) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (sort) params.append('sort', sort);

    const response = await api.get(`/users/paginated?${params.toString()}`);
    return response.data;
  },

  // Get user by ID (admin or own profile)
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Get active users (admin only)
  getActiveUsers: async () => {
    const response = await api.get('/users/active');
    return response.data;
  },

  // Search users by name (admin only)
  searchUsers: async (name) => {
    const response = await api.get(`/users/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  // Get users by role (admin only)
  getUsersByRole: async (roleName) => {
    const response = await api.get(`/users/by-role/${roleName}`);
    return response.data;
  },

  // Get users created between dates (admin only)
  getUsersCreatedBetween: async (startDate, endDate) => {
    const response = await api.get(`/users/created-between?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Get active users count (admin only)
  getActiveUsersCount: async () => {
    const response = await api.get('/users/count/active');
    return response.data;
  },

  // Update user (admin or own profile)
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Deactivate user (admin only)
  deactivateUser: async (id) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  // Activate user (admin only)
  activateUser: async (id) => {
    const response = await api.patch(`/users/${id}/activate`);
    return response.data;
  }
};

export default userService;