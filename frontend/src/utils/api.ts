// frontend/utils/api.ts
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDevelopment
  ? 'http://localhost:3001/api' 
  : '/api';

export const fetchFromApi = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
  });
  return response;
};