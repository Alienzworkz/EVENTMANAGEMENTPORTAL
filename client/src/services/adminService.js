import api from './api';

export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserBookings: (id) => api.get(`/admin/users/${id}/bookings`),
  getStats: () => api.get('/admin/stats'),
  getOrganizerStats: () => api.get('/admin/organizer-stats'),
};

export default adminService;
