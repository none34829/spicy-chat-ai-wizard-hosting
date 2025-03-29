const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' 
  : 'https://spicy-chat-ai-wizard-hosting-production.up.railway.app/api');

export const fetchFromApi = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
  });
  return response;
};
