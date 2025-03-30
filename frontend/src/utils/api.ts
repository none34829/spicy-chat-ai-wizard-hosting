const API_BASE_URL = import.meta.env.VITE_API_URL 
  || 'https://spicy-chat-ai-wizard-hosting-production.up.railway.app/api';

export const fetchFromApi = async (
  endpoint: string, 
  options: RequestInit = {}
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("Making API request to:", url);
  
  const response = await fetch(url, {
    ...options,
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers 
    },
    // Remove credentials for cross-origin requests
    credentials: window.location.hostname.includes('localhost') ? 'include' : 'omit',
  });
  
  try {
    const data = await response.json();
    console.log("API response:", data); 
    return data;
  } catch (error) {
    console.error("API error:", error); 
    return { status: 'error', message: 'Invalid JSON response', raw: await response.text() };
  }
};
