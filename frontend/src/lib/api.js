import { supabase } from '../config/supabaseClient';

export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("Missing VITE_API_URL environment variable. Please set it in your .env file.");
}

export async function apiFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  } else {
    console.warn("[API] No session token found. Request will be unauthenticated.");
  }

  console.log(`%c[API Request] %c${options.method || 'GET'} %c${path}`, 'color: blue; font-weight: bold;', 'color: green;', 'color: black;');

  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error(`%c[API Error] %c${response.status} ${response.statusText} %cfor ${path}`, 'color: red; font-weight: bold;', 'color: orange;', 'color: black;', errorPayload);
      throw new Error(errorPayload.error || `Request failed with status ${response.status}`);
    }

    const payload = await response.json().catch(() => null);
    console.log(`%c[API Response] %c${response.status} %cfor ${path}`, 'color: blue; font-weight: bold;', 'color: green;', 'color: black;', payload);
    return payload;

  } catch (error) {
    console.error('%c[Network Error] %cCould not connect to API. Is the backend running?', 'color: red; font-weight: bold;', 'color: black;', error);
    throw error;
  }
}