const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (window.location.hostname.includes('localhost') 
      ? 'http://localhost:3001/api' 
      : 'https://spicy-chat-ai-wizard-hosting-production.up.railway.app/api');

export const fetchFromApi = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' }, // Add this to ensure JSON headers
    credentials: 'include',
  });

  return response.json(); // Ensure the response is parsed
};
