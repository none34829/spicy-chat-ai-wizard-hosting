const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (window.location.hostname.includes('localhost') 
      ? 'http://localhost:3001/api' 
      : 'https://spicy-chat-ai-wizard-hosting-production.up.railway.app/api');

      export const fetchFromApi = async (
        endpoint: string, 
        options: RequestInit = {} // TypeScript now knows it's an object with fetch options
      ) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      
        try {
          return await response.json();
        } catch (error) {
          return { status: 'error', message: 'Invalid JSON response', raw: await response.text() };
        }
      };
      
      
