const API_BASE_URL = 'https://spicy-chat-ai-wizard-hosting-production.up.railway.app/api';

export const fetchFromApi = async (
  endpoint: string, 
  options: RequestInit = {}
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("Making API request to:", url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers 
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data); 
    return data;
  } catch (error: unknown) {
    console.error('API request failed:', error);
    return { 
      status: 'error', 
      message: 'Invalid API response', 
      raw: error instanceof Error ? error.message : String(error)
    };
  }
};
