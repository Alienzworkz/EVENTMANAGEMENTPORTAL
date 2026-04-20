export const API_URL = '/api';

export const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'concert', label: 'Concert' },
  { value: 'sports', label: 'Sports' },
  { value: 'networking', label: 'Networking' },
  { value: 'other', label: 'Other' },
];

export const STATUSES = [
  { value: 'all', label: 'All Status' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const ROLES = [
  { value: 'all', label: 'All Roles' },
  { value: 'attendee', label: 'Attendee' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'admin', label: 'Admin' },
];

export const CATEGORY_ICONS = {
  conference: '🎤',
  workshop: '🛠️',
  seminar: '📚',
  concert: '🎵',
  sports: '⚽',
  networking: '🤝',
  other: '📌',
};
