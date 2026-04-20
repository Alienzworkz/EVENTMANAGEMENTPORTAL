import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPrice(price) {
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export function formatTime(time) {
  return time;
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getCategoryColor(category) {
  const colors = {
    conference: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    workshop: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    seminar: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    concert: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    sports: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    networking: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  };
  return colors[category] || colors.other;
}

export function getStatusColor(status) {
  const colors = {
    upcoming: 'badge-primary',
    ongoing: 'badge-warning',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    confirmed: 'badge-success',
    pending: 'badge-warning',
  };
  return colors[status] || 'badge-primary';
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
