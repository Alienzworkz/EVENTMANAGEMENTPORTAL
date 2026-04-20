import api from './api';

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getEventBookings: (eventId) => api.get(`/bookings/event/${eventId}`),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

export default bookingService;
