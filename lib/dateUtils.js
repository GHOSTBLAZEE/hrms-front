/**
 * Date Utilities for Leave Management
 * 
 * Handles all date formatting and parsing to avoid timezone issues
 * Backend sends dates as "YYYY-MM-DD" strings
 */

/**
 * Parse a date string safely without timezone conversion
 * Input: "2026-01-30" → Output: Jan 30, 2026 (local)
 */
export function parseLocalDate(dateString) {
  if (!dateString) return null;
  
  // Split the date string and parse as local date
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format date for display: "Jan 30, 2026"
 */
export function formatDate(dateString, options = {}) {
  const date = parseLocalDate(dateString);
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', {
    month: options.month || 'short',
    day: options.day || '2-digit',
    year: options.year || 'numeric',
    ...options,
  });
}

/**
 * Format date for display: "Jan 30"
 */
export function formatShortDate(dateString) {
  return formatDate(dateString, { year: undefined });
}

/**
 * Format date range: "Jan 30 - Feb 5, 2026"
 */
export function formatDateRange(startDate, endDate) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  
  if (!start || !end) return '';
  
  // Same date
  if (startDate === endDate) {
    return formatDate(startDate);
  }
  
  // Same month and year
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - ${end.getDate()}, ${end.getFullYear()}`;
  }
  
  // Same year
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}, ${end.getFullYear()}`;
  }
  
  // Different years
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Get date string for input field (YYYY-MM-DD)
 */
export function toDateInputString(date) {
  if (!date) return '';
  
  const d = date instanceof Date ? date : parseLocalDate(date);
  if (!d) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date is in the past
 */
export function isPastDate(dateString) {
  const date = parseLocalDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
}

/**
 * Check if a date is today
 */
export function isToday(dateString) {
  const date = parseLocalDate(dateString);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Get relative time: "2 days ago", "in 3 days"
 */
export function getRelativeTime(dateString) {
  const date = parseLocalDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Get days between two dates (inclusive)
 */
export function getDaysBetween(startDate, endDate) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}