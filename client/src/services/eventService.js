import api from './api';

export const eventService = {
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyEvents: (params) => api.get('/events/organizer/my-events', { params }),
  approveEvent: (id, data) => api.put(`/events/${id}/approve`, data),
  getAllEventsAdmin: (params) => api.get('/events/admin/all', { params }),
};

export default eventService;
